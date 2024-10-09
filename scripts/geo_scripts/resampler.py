# Author: Richard Aja
# Title: Resampler Function
# Description: Preforms resampling on variables within a netcdf file

from netCDF4 import Dataset
import traceback
import numpy as np
from os import listdir, makedirs
from os.path import isfile, join, basename, exists, dirname
from rasterio.transform import from_origin
import xarray
import rasterio
import rioxarray as riox
import sys

KM_TO_M = 10**6


def handle_user_input(parameters):
    """
    Checks the command line arguments and extracts the directory path and the target shape for the geo data
        Note Valid Command Line Examples:
            - valid command line inputs include
            - python ba_script.py ./BA (90,144)
            - python ba_script.py ./BA 90 144

    :param parameters: a list of all the parameters passed at the command line
    :return: both the directory path and the shape as a tuple
    """
    try:
        dir_path = (
            parameters[0]
            if len(parameters) >= 1 and exists(dirname(parameters[0]))
            else input("[*] Please enter the directory path to the file: ")
        )
        new_shape = (
            (int(parameters[1]), int(parameters[2]))
            if parameters[1].isdigit() and parameters[1].isdigit()
            else None
        )
        if new_shape == None:
            scaling_size_height = int(
                input("[*] Please enter the height of the new scale: ")
            )
            scaling_size_width = int(
                input("[*] Please enter the width of the new scale: ")
            )
            new_shape = (scaling_size_height, scaling_size_width)

        netcdf_variable = (
            parameters[3]
            if len(parameters) >= 3
            else input("[*] Please enter the variable name you wish to upscale: ")
        )
        return (dir_path, new_shape, netcdf_variable)
    except:
        return


class Resampler:
    """
    GeoDataResize is a class that is meant to manipulate and change the format of geodata, improving the overall analysis of geo data (currently netcdf)

    :Attribute files: the list of files that the user would like to manipulate (currently only netcdf geo data)
    """

    def __init__(self, dir_path, new_shape) -> None:
        """
        initializes the class and sets the files

        :param dir_path: the path of the files we wish to parse
        :return: None
        """
        self.files = self.obtain_nc_files(dir_path)
        self.save_folder_path = join(dir_path, "upscale")
        self.dest_shape = new_shape
        if not exists(self.save_folder_path):
            makedirs(self.save_folder_path)

    def create_geotif(self, data_arr, latitude_arr, longitude_arr):
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
            "crs": "EPSG:3857",  # optional formats EPSG:3857 (works on panoply) EPSG:4326 (works well on leaflet)
            "transform": transform,
        }

        # obtain the GeoTIFF path
        geotiff_file_path = join(self.save_folder_path, "output.tif")
        # Create a new GeoTIFF file using the crafted path and add the data to the file
        with rasterio.open(geotiff_file_path, "w", **metadata) as dst:
            # total_data_value = np.flip(data_arr, 0)
            dst.write(data_arr, 1)
        # return the GeoTIFF file path
        return geotiff_file_path

    def obtain_nc_files(self, dir_path) -> list:
        """
        loops through files in the current director and returns a list of files that are netcdf files

        :param dir_path: the file path
        :return: all files in the "dir_path" that are netcdf files
        """
        return [
            join(dir_path, file)
            for file in listdir(dir_path)
            if isfile(join(dir_path, file))
            and (file.split(".")[-1] == "hdf5" or file.split(".")[-1] == "nc")
        ]

    def evaluate_resample(
        self, origin_matrix, upscaled_matrix, margin_of_error=65536.0
    ):
        """
        Function prints our the original matrix sum and the upscaled matrix sum (post re grid)
        It then determines if the upscaled matrix sum is close enough to the original matrix sum (incorporating a margin of error)

        :param origin_matrix: original matrix before re grid
        :param upscaled_matrix: the original matrix post re grid
        :param margin_of_error: the margin of error the allowed
        :return: boolean
        """
        print()
        print(f"Original Burned Area Total - {origin_matrix.sum()}")
        print(f"\tOriginal Burned Area Dimensions - {origin_matrix.shape}")
        print(f"Upscale Burned Area Total - {upscaled_matrix.sum()}")
        print(f"\tUpscale Burned Area Dimensions - {upscaled_matrix.shape}")
        print()

        # returns true if the upscaled matrix sum is within the range of the original matrix sum (margin of error accounts for rounding of values)
        return upscaled_matrix.sum() >= (
            origin_matrix.sum() - margin_of_error
        ) and origin_matrix.sum() <= (origin_matrix.sum() + margin_of_error)

    def save_file(self, file_path, data_set) -> None:
        """
        Saves the xarray dataset based on the file inputted to the function

        :param file_path: file path of the current file being upscaled/processed
        :param data_set: data set representing the
        :return: None
        """
        try:
            # create the new file's path & name
            # new_file_name = self.obtain_new_filename(file_path)
            # checks if the save folder path exists (if it does not a folder is created)
            if not exists(self.save_folder_path):
                makedirs(self.save_folder_path)
            # saves the file using the created file path and xarray
            data_set.to_netcdf(path=(file_path))
            print(f"[+] file {file_path} saved")
        except Exception as error:
            print(
                "[-] Failed to save dataset (ensure dataset is from xarray lib): ",
                error,
            )

    def obtain_new_filename(self, file_path) -> str:
        # creates a file name (adding upscale to the current file name)
        file_name = basename(file_path)
        file_name_list = file_name.split(".")
        if len(file_name_list) > 1:
            file_name_list[-2] = file_name_list[-2] + "(upscaled)"
            # ensures the file is saved as a netcdf file
            file_name_list[-1] = "nc"
            # return the rejoined list and the added classes save folder path
            return join(self.save_folder_path, ".".join(file_name_list))
        return join(self.save_folder_path, file_name)

    def resample_matrix(self, source_matrix):
        """
        Function preforms the process of upscaling the passed in matrix using rasterio and geotiff

        :param source_matrix: matrix we wish to compress (upscale)
        :param dest_dimensions: a tuple/list containing the dimensions you want to transform the matrix ex.) (90, 144)
        :return: reshaped numpy matrix
        """
        # https://github.com/corteva/rioxarray/discussions/332
        # Obtain the numpy array shape
        print(source_matrix.shape)
        height, width = source_matrix.shape
        # create a long and latitude numpy array
        latitude_arr = np.linspace(-90, 90, height)
        longitude_arr = np.linspace(-180, 180, width)

        # create the geotiff file and return the path to that file
        geotiff_file_path = self.create_geotif(
            source_matrix, latitude_arr, longitude_arr
        )
        # open that newly created geotiff file
        raster = riox.open_rasterio(geotiff_file_path)

        # preform upsampling using rasterio and rioxarray
        up_sampled = raster.rio.reproject(
            raster.rio.crs,
            shape=self.dest_shape,
            resampling=rasterio.warp.Resampling.sum,
        )

        # obtain the data
        data_value = up_sampled.values[0]
        # close the file (script will yell at you if you dont)
        raster.close()
        # return numpy data array
        return data_value

    def upscale_data(self, variable_name) -> None:
        """
        loops through each file in the classes files list Regridding (upscaling) datasets from a fine resolution to a coarse (ModelE) resolution
        Note - This is focused on the burned area dataset and uses both netcdf (parsing/reading) and xarray (saving the data)
            Issue (SOLVED) - When saving the dataset the unscaled burned area is classified as a 2D variable instead of a Geo2D variable

        :param: None
        :return: None
        """
        for file in self.files:
            try:
                netcdf_dataset = xarray.open_dataset(file)
                # dataset containing all xarray data array (used to create the final netcdf file)
                dataset_dict = {}
                # dataset_dict = netcdf_dataset.to_dict(data="list", encoding=True)

                # obtain the variables in the netcdf_dataset
                # dimensions (1, 720, 1440)
                var_data = netcdf_dataset.variables[variable_name]

                # obtain the numpy array for each netcdf variable
                # transform the arrays dimensions to (720, 1440) and convert the metric to km^2 -> m^2
                var_data_array = var_data[:][0]

                # preform resampling/upscaling using rasterio
                # Conversion (720, 1440) -> (90, 144)
                upscaled_var_data_array = self.resample_matrix(var_data_array)

                if self.evaluate_resample(var_data_array, upscaled_var_data_array):
                    attribute_dict = {}

                    # Copy attributes of the burned area fraction
                    # for attr_name in var_data.ncattrs():
                    #     attribute_dict[attr_name] = getattr(var_data, attr_name)

                    # obtain the height and width from the upscale shape
                    # create an evenly spaced array representing the longitude and the latitude
                    height, width = upscaled_var_data_array.shape
                    latitudes = np.linspace(-90, 90, height)
                    longitudes = np.linspace(-180, 180, width)

                    # flip the data matrix (upside down due to the GFED dataset's orientation)
                    # burned_fraction_upscaled = np.flip(burned_fraction_upscaled, 0)

                    # create the xarray data array for the upscaled burned area and add it to the dictionary
                    burned_area_data_array = xarray.DataArray(
                        upscaled_var_data_array,
                        coords={"latitude": latitudes, "longitude": longitudes},
                        dims=["latitude", "longitude"],
                        attrs=attribute_dict,
                    )
                    dataset_dict[variable_name] = burned_area_data_array

                netcdf_dataset.close()
                # saves xarray dataset to a file
                self.save_file(file, xarray.Dataset(dataset_dict))
            except Exception as error:
                print("[-] Failed to parse dataset: ", error)
                print(traceback.format_exc())


def main():
    parameters = list(sys.argv)[1:]
    dir_path, shape, netcdf_variable_name = handle_user_input(parameters)
    Analysis = Resampler(dir_path=dir_path, new_shape=shape)
    Analysis.upscale_data(variable_name=netcdf_variable_name)


if __name__ == "__main__":
    main()
