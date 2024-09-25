from os import listdir
from os.path import join, isfile
from subprocess import call, run

FLASK_API_PATH = "./scripts/route/api"
FLASK_API_DIR = "./scripts/route/"


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
    try:
        call(["npm", "run", "start"])
    except:
        print("[-] Failed to start the server")


def startFlaskServer():
    # try:
    # flask --app nmapScanner.py run
    # run(f"export FLASK_APP={FLASK_API_PATH}")
    result = run(f"python {FLASK_API_PATH}", cwd=FLASK_API_DIR)
    print(result.args)


def main():
    # start flask server
    startFlaskServer()
    # generate and export the frontend
    startReactFrontend()


if __name__ == "__main__":
    main()
