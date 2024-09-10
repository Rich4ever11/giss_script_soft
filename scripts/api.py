from flask import Flask
from netCDF4 import Dataset
import numpy as np
from os import listdir, makedirs
from os.path import isfile, join, basename, exists
import json
from json import JSONEncoder
import xarray
import json

app = Flask(__name__)

geo_data_file = "../geo_data/BA201001.nc"


class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)


@app.route("/")
def obtain_geodata():
    with Dataset(geo_data_file) as netcdf_dataset:
        totalData = netcdf_dataset.variables["Total"][:][0]
        numpyData = {"array": totalData}
        encodedNumpyData = json.dumps(numpyData, cls=NumpyArrayEncoder)
        return encodedNumpyData
    return "Hello World"
