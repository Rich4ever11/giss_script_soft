import { Text, Button, Card, CardBody, Stack } from "@chakra-ui/react";
import { useGeoData } from "../../context/GeoDataContext";

function GeoUpload() {
  const { fileName, setFileName, setNetcdfData } = useGeoData();

  const handleGeoDataFunction = (event: any) => {
    const netcdfFile = event.target.files[0];
    var blobUrl = URL.createObjectURL(netcdfFile);

    var data = new FormData();
    data.append("files", netcdfFile);
    data.append("name", netcdfFile.name);

    // var reader = new FileReader();
    // reader.readAsArrayBuffer(netcdfFile);
    // console.log(reader);

    fetch("http://127.0.0.1:5000/send_netcdf", {
      method: "POST",
      body: data,
    })
      .then(async (res) => {
        const result = await res.json();
        if (result.status === "success") {
          setFileName(netcdfFile.name);
          setNetcdfData(result.data.geo_data);
        }
      })
      .catch((error) => {
        console.log("[-] Failed to upload file");
      });
    // console.log(blobUrl);
  };

  const handleClearNetcdfFile = () => {
    setFileName("");
    setNetcdfData({});
  };

  return (
    <>
      <Card
        align="center"
        backgroundColor={"black"}
        color={"black"}
        bgGradient="linear(black 0%, black 5%, blue.900 80%)"
        rounded={"none"}
      >
        <CardBody>
          <Text fontSize="5xl" textColor={"white"} fontWeight={2}>
            {fileName === "" ? "Upload Geographic Data" : fileName}
          </Text>
        </CardBody>
        {fileName === "" ? (
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload Netcdf</span>{" "}
                  or drag and drop
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleGeoDataFunction}
                accept=".nc"
              />
            </label>
          </div>
        ) : (
          <></>
        )}

        {fileName && (
          <Stack direction="row" spacing={4} align="center" pb={4}>
            <Button
              backgroundColor={"black"}
              color={"white"}
              variant="solid"
              onClick={handleClearNetcdfFile}
            >
              Clear NETCDF File
            </Button>
          </Stack>
        )}
      </Card>
    </>
  );
}

export default GeoUpload;
