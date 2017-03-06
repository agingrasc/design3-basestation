import sys
import subprocess

url = sys.argv[1]

proc_vision = subprocess.Popen("./server/service/vision.py", shell=True)
proc_vision_fake = subprocess.Popen(
    "./server/service/fakevision.py", shell=True)
proc_main_api = subprocess.Popen("./server/main.py " + url, shell=True)

proc_install_ui = subprocess.Popen(["cd client;npm install"], shell=True)
proc_install_ui.communicate()
proc_ui = subprocess.Popen(["cd client;au run"], shell=True)

proc_vision_fake.communicate()
proc_vision.communicate()
proc_main_api.communicate()
proc_ui.communicate()
