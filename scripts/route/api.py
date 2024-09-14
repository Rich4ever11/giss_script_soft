import os
from flask import Flask
from netCDF4 import Dataset
import numpy as np
from os import listdir, makedirs
from os.path import isfile, join, basename, exists
import rioxarray as rio
import json
from json import JSONEncoder
import xarray
import json
from flask import request, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {"nc"}
UPLOAD_FOLDER = "../../geo_data"

GEO_DATA_FILE = "../../geo_data/BA201001.nc"
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

app = Flask(__name__)
CORS(app)


@app.before_request
def limit_remote_addr():
    remote_ip = str(request.remote_addr)
    if remote_ip != "127.0.0.1":
        abort(403)


class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)


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


# def obtain_script_libraries(file_path):


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
        return {"status": "success", "data": get_geofile_data(VALID_GEO_FILES[0])}


@app.route("/send_netcdf", methods=["GET", "POST"])
def obtain_netcdf_data():
    if request.method == "POST":
        files_dict = request.files.to_dict()
        # check if the post request has the file part
        if "file" not in files_dict:
            print("No file part")
        file = files_dict["files"]
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == "":
            print("No selected file")
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(join(UPLOAD_FOLDER, filename))
            return json.dumps(
                {"status": "success", "data": {"message": "file successfully saved"}}
            )
    return json.dumps(
        {"status": "failed", "data": {"message": "file unsuccessfully saved"}}
    )


@app.route("/run_script", methods=["POST"])
def run_geoscript():
    if request.method == "POST":
        filename = request.form.get("filename")
        if filename in VALID_SCRIPTS:
            with open(filename) as file:
                print(filename)
                # exec(file.read())
        else:
            return json.dumps(
                {"status": "failed", "data": {"message": "invalid file passed in"}}
            )


# @app.route("/obtain_geo_file")
# def obtain_geodata():
#     return json.dumps(VALID_GEO_FILES)
