# GISS NETCDF Software

The giss_script_soft is a software application that allows users to upload, manipulate, and view both NetCDF and GeoTIFF files on an interactive Leaflet map. The purpose of this software is to enhance the analysis of NetCDF files by focusing on specific data within a NetCDF file using a two-dimensional map, facilitating the execution of related NetCDF scripts in an easy, interactive manner, and enabling users to view the output of the NetCDF files.

This software utilizes React.js for the front end and Flask for the back end. To run this application, users must have both Node.js and Python installed. For the back end, only the localhost (the user running the software) can access the Flask server, ensuring that all information remains local to that user. This design enhances security and prevents outside users on the network from accessing the software. The Flask server's sole purpose is to allow for the use and implementation of NetCDF related Python functions and libraries.

On the front end, the application uses React.js with TypeScript. The core front end is divided into three main components: the NetCDF input, the scripts that can be executed on the NetCDF file (currently limited to resampling), and the map that can accept GeoTIFF files or convert the provided NetCDF file into a GeoTIFF for display on the map. Both components of the application can be run using the main.py file located in the top-level folder of the software. Suggestions and recommendations are encouraged to help improve the application.

- [x] **Ability to Upload Geotiff files and have it display on a map (leaflet)**
  - [x] **User can upload netcdf file (exclusively)**
  - [x] **Netcdf file is converted into a geotiff**
  - [x] **the newly created geotiff file is returned to the react app and displayed on the leaflet map**
- [x] **Ability to preform resampling on inputted netcdf files**
  - [x] **Upon the completion of resampling the new resampled netcdf file is returned to the user**
  - [ ] **Currenlty working on making the code more flexible to allow for new scripts to be input and ran**
- [x] **Software includes the ability to clear the map layer whether the flask server is active or non active**
- [x] **Software allows for a user to upload a geotiff and have it display on the map**
- [ ] **Netcdf time series needs to be implemented and improved**


## Project Requirements 
  - Python (used to run the flask server)
  - node.js (used to run the react app)

## [Project Demo](https://drive.google.com/file/d/1avPWj7Tf7vnZ-Sdp3eDvItxE3DljsH0G/view?usp=sharing)


![ezgif-3-fa4cb0fcdf](https://github.com/user-attachments/assets/a15ac458-c283-4a07-922e-3c09f0dd4b77)

![ezgif-3-25120e36bf](https://github.com/user-attachments/assets/d4d48fa0-b7f4-44c5-9d05-77f5f9d60464)

