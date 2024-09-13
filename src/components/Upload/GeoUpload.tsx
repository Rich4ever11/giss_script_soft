import {
  Box,
  Divider,
  AbsoluteCenter,
  Text,
  Center,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
} from "@chakra-ui/react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaGlobeAmericas } from "react-icons/fa";
import React from "react";
import { useGeoData } from "../../context/GeoDataContext";

function GeoUpload() {
  const { netcdfData, setNetcdfData } = useGeoData();
  const handleGeoDataFunction = (event: any) => {
    const netcdfFile = event.target.files[0];
    var blobUrl = URL.createObjectURL(netcdfFile);
    console.log(blobUrl);
    setNetcdfData(netcdfFile);
  };

  return (
    <>
      <Card
        align="center"
        backgroundColor={"blue.900"}
        color={"black"}
        bgGradient="linear(black 0%, black 5%, blue.900 50%)"
        rounded={"none"}
      >
        <CardBody>
          <Text fontSize="5xl" textColor={"white"} fontWeight={2}>
            Upload Geographic Data
          </Text>
        </CardBody>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-black border-dashed rounded-lg cursor-pointer bg-black dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload Netcdf</span> or
                drag and drop
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleGeoDataFunction}
            />
          </label>
        </div>
      </Card>
    </>
  );
}

export default GeoUpload;
