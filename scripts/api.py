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

app = Flask(__name__)

geo_data_file = "../geo_data/BA201001.nc"


class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)


@app.route("/")
def obtain_geodata():
    nc_file = xarray.open_dataset(geo_data_file)
    bT = nc_file["Total"]
    bT = bT.rio.set_spatial_dims(x_dim="lon", y_dim="lat")
    bT.rio.write_crs("epsg:4326", inplace=True)
    bT.rio.to_raster(r"test.tif")
    with Dataset(geo_data_file) as netcdf_dataset:
        totalData = netcdf_dataset.variables["Total"][:][0]
        numpyData = {"array": totalData}
        encodedNumpyData = json.dumps(numpyData, cls=NumpyArrayEncoder)
        # return encodedNumpyData
    return "Hello World"
