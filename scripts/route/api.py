import base64
import os
import rasterio
from flask import Flask, Response
from netCDF4 import Dataset
import numpy as np
from os import listdir, makedirs
from os.path import isfile, join, basename, exists
import rioxarray as rio
import json
from json import JSONEncoder
from rasterio.transform import from_origin
import json
from flask import request, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename
from subprocess import call


ALLOWED_EXTENSIONS = {"nc"}
UPLOAD_FOLDER = "../geo_scripts/geo_data"
NETCDF_FILENAME = "curr.nc"
GEOTIF_FILENAME = "curr.tif"
CURRENT_NETCDF_FILEPATH = join(UPLOAD_FOLDER, NETCDF_FILENAME)
CURRENT_GEOTIF_FILEPATH = join(UPLOAD_FOLDER, GEOTIF_FILENAME)

GEO_DATA_FOLDER = "../geo_scripts/geo_data"
GEO_DATA_SCRIPTS_FOLDER = "../geo_scripts"

VALID_SCRIPTS = [
    join(GEO_DATA_SCRIPTS_FOLDER, file)
    for file in listdir(GEO_DATA_SCRIPTS_FOLDER)
    if isfile(join(GEO_DATA_SCRIPTS_FOLDER, file))
]

VALID_GEO_FILES = [
    join(GEO_DATA_FOLDER, file)
    for file in listdir(GEO_DATA_FOLDER)
    if isfile(join(GEO_DATA_FOLDER, file))
    and (file.split(".")[-1] == "hdf5" or file.split(".")[-1] == "nc")
]


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def get_geofile_data(file_path):
    var_info_list = []
    with Dataset(file_path) as netcdf_dataset:
        for var in netcdf_dataset.variables:
            if len(netcdf_dataset.variables[var].shape) > 1:
                var_data = {
                    "name": var,
                    "dimensions": netcdf_dataset.variables[var].shape,
                }
                var_info_list.append(var_data)
    geo_data = {"variables": var_info_list}
    return geo_data


def obtain_file_metadata(file_path):
    metadata = {}
    metadata["path"] = file_path
    with open(file_path) as f:
        for line in f:
            if line.startswith("#"):
                line = line.replace("#", "")
                line = line.strip()
                key, value = str(line).split(":")
                metadata[key.strip()] = value.strip()
            else:
                return metadata
    return metadata


def create_geotiff_file(data_arr, latitude_arr, longitude_arr, geotiff_file_path):
    """
    Creates a new geotif file to be used for resampling or displaying data on the map

    :param data_arr: numpy array containing the geo data
    :param latitude_arr: numpy array representing the latitude
    :param longitude_arr: numpy array representing the longitude
    :return: geotiff file path
    """
    # obtain the data_arr shape
    height, width = data_arr.shape
    # create a transformation of the data to match a global map
    transform = from_origin(
        longitude_arr[0],
        latitude_arr[-1],
        abs(longitude_arr[1] - longitude_arr[0]),
        abs(latitude_arr[-1] - latitude_arr[-2]),
    )

    # outline meta data about the geotiff file
    metadata = {
        "driver": "GTiff",
        "count": 1,
        "dtype": "float32",
        "width": width,
        "height": height,
        "crs": "EPSG:4326",  # optional formats EPSG:3857 (works on panoply) EPSG:4326 (works well on leaflet)
        "transform": transform,
    }

    data_arr[data_arr.mask] = 0
    # Create a new GeoTIFF file using the crafted path and add the data to the file
    with rasterio.open(geotiff_file_path, "w", **metadata) as dst:
        data_arr = np.flip(data_arr, 0)
        dst.write(data_arr, 1)
    # return the GeoTIFF file path
    return geotiff_file_path


app = Flask(__name__)
CORS(app)


@app.before_request
def limit_remote_addr():
    remote_ip = str(request.remote_addr)
    if remote_ip != "127.0.0.1":
        abort(403)


@app.route("/view_scripts", methods=["GET"])
def obtain_geoscripts():
    file_data = []
    for file in VALID_SCRIPTS:
        script_data = {"file_metadata": obtain_file_metadata(file)}
        file_data.append(script_data)
    return json.dumps({"status": "success", "data": file_data})


@app.route("/view_geofile_data", methods=["GET"])
def obtain_geofile_data():
    if request.method == "GET":
        return {"status": "success", "data": get_geofile_data(CURRENT_NETCDF_FILEPATH)}


@app.route("/send_netcdf", methods=["GET", "POST"])
def obtain_netcdf_data():
    if request.method == "POST":
        files_dict = request.files.to_dict()
        # check if the post request has the file part
        # if "file" not in files_dict:
        #     print("No file part")
        file = files_dict["files"]
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == "":
            print("No selected file")
        if file and allowed_file(file.filename):
            file.save(CURRENT_NETCDF_FILEPATH)
            file.close()
            return json.dumps(
                {
                    "status": "success",
                    "data": {
                        "message": "file successfully saved",
                        "geo_data": get_geofile_data(CURRENT_NETCDF_FILEPATH),
                    },
                }
            )
    return json.dumps(
        {"status": "failed", "data": {"message": "file unsuccessfully saved"}}
    )


@app.route("/run_script", methods=["POST"])
def run_geoscript():
    if request.method == "POST":
        try:
            json_data = request.json
            shape_height = json_data["height"]
            shape_width = json_data["width"]
            filePath = json_data["filePath"]
            if filePath in VALID_SCRIPTS:
                with open(filePath) as file:
                    print(filePath, shape_height, shape_width)
                    call(
                        [
                            "python",
                            filePath,
                            GEO_DATA_FOLDER,
                            str(shape_height),
                            str(shape_width),
                        ]
                    )
                    # os.remove(CURRENT_GEOTIF_FILEPATH)
                    return json.dumps(
                        {"status": "success", "data": {"message": "script ran"}}
                    )
            return json.dumps(
                {"status": "failed", "data": {"message": "invalid file passed in"}}
            )
        except:
            return json.dumps(
                {
                    "status": "failed",
                    "data": {"message": "failed to run script (try a different file)"},
                }
            )


@app.route("/get_geotiff", methods=["POST"])
def get_geotiff():
    if request.method == "POST":
        data = request.get_json()
        variable_name = data["variable_name"]
        time = int(data["time"])
        print(variable_name)
        with Dataset(CURRENT_NETCDF_FILEPATH) as netcdf_dataset:
            if variable_name in netcdf_dataset.variables.keys():
                data_arr = netcdf_dataset.variables[variable_name][:]
                if len(data_arr.shape) == 3:
                    if time >= 1 and time <= int(data_arr.shape[0]):
                        data_arr = data_arr[time - 1]
                    else:
                        data_arr = data_arr[0]
                else:
                    while len(data_arr.shape) > 2:
                        data_arr = data_arr[0]

                print(data_arr)

                # data_arr[data_arr.mask] = 0
                height, width = data_arr.shape
                # create a long and latitude numpy array
                latitude_arr = np.linspace(-90, 90, height)
                longitude_arr = np.linspace(-180, 180, width)
                create_geotiff_file(
                    data_arr, latitude_arr, longitude_arr, CURRENT_GEOTIF_FILEPATH
                )
                file = open(CURRENT_GEOTIF_FILEPATH, "rb")
                byte_array = file.read()
                file.close()
                return Response(
                    byte_array,
                    mimetype="image/tiff",  # Set MIME type for text files
                )
            else:
                return json.dumps(
                    {
                        "status": "failed",
                        "data": {"message": "failed to create geotiff"},
                    }
                )
        return json.dumps(
            {"status": "failed", "data": {"message": "failed to create geotiff"}}
        )


if __name__ == "__main__":
    app.run()
