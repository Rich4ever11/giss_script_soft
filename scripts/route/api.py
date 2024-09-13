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
from flask import request
from flask_cors import CORS
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {"nc"}
UPLOAD_FOLDER = "../../geo_data"

GEO_DATA_FILE = "../../geo_data/BA201001.nc"
GEO_DATA_FOLDER = "../geo_scripts/geo_data"
GEO_DATA_SCRIPTS_FOLDER = "../geo_scripts"

app = Flask(__name__)
CORS(app)


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


class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/")
def obtain_geoscripts():
    return json.dumps(VALID_SCRIPTS)


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
                {"status": "success", "message": "file successfully saved"}
            )
    return json.dumps({"status": "failed", "message": "file unsuccessfully saved"})


@app.route("/run_script/<script>", methods=["POST"])
def run_geoscript():
    if request.method == "POST":
        filename = request.form.get("filename")
        if filename in VALID_SCRIPTS:
            with open(filename) as file:
                print(filename)
                # exec(file.read())
        else:
            return json.dumps({"error": "invalid file passed in"})


@app.route("/obtain_geo_files")
def obtain_geodata():
    return json.dumps(VALID_GEO_FILES)
