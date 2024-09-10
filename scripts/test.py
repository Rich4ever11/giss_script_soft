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
from rasterio.transform import from_origin
import rasterio

geo_data_file = "../geo_data/BA201001.nc"

nc_file = xarray.open_dataset(geo_data_file)
bT = nc_file["Total"]
total_data = bT.values
bT = bT.rio.set_spatial_dims(x_dim="lat", y_dim="lon")
bT = bT.rio.write_crs("epsg:4326", inplace=True)
# bT.isel(time=0).rio.to_raster("planet_scope.tif")

# burned_area_data_array.rio.write_crs("epsg:4326", inplace=True)
# bT.rio.to_raster(
#     r"medsea_bottomT_raster.tif", driver="GTiff", tiled=True, windowed=True
# )

print(nc_file["lat"].values)

print(total_data[0])

latitude = nc_file["lat"].values
longitude = nc_file["lon"].values

transform = from_origin(
    longitude[0],
    latitude[-1],
    abs(longitude[1] - longitude[0]),
    abs(latitude[-1] - latitude[-2]),
)

da0 = xarray.DataArray(
    data=total_data[0],
    dims=["y", "x"],
    coords={
        "y": nc_file["lat"].values,
        "x": nc_file["lon"].values,
    },
)
da0 = da0.rio.write_crs("epsg:4326", inplace=True)
da0 = da0.rio.write_transform((transform), inplace=True)
da0.rio.to_raster(
    r"new.tif",
)


metadata = {
    "driver": "GTiff",
    "count": 1,
    "dtype": "float32",
    "width": total_data[0].shape[1],
    "height": total_data[0].shape[0],
    "crs": "EPSG:4326",
    "transform": transform,
}

# Write the GeoTIFF
with rasterio.open("output.tif", "w", **metadata) as dst:
    total_data_value = np.flip(total_data[0], 0)
    dst.write(total_data_value, 1)
