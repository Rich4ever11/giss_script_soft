from os import listdir
from os.path import join, isfile
from subprocess import call, run
import subprocess

FLASK_API_PATH = "api.py"
FLASK_API_DIR = "./scripts/route/"

NPM_START_DIR = "."


def startReactFrontend():
    # installation_status = call(["npm", "install"])
    # if installation_status.returncode == 0:
    #     print(
    #         "[+] The node modules have been installed %d"
    #         % installation_status.returncode
    #     )
    # else:
    #     print(
    #         "[-] The node modules have not been installed %d"
    #         % installation_status.returncode
    #     )
    # npm_package_install_result = subprocess.Popen("npm install", shell=True)
    # print(npm_package_install_result)
    npm_run_result = subprocess.Popen("npm run start", shell=True)
    print(npm_run_result)


def startFlaskServer():
    # try:
    # flask --app nmapScanner.py run
    # run(f"export FLASK_APP={FLASK_API_PATH}")
    result = subprocess.Popen(f"python {FLASK_API_PATH}", cwd=FLASK_API_DIR)
    print(result.args)


def main():
    # start flask server
    startFlaskServer()
    # generate and export the frontend
    startReactFrontend()


if __name__ == "__main__":
    main()
