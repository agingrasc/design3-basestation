import sys
import os
import subprocess

url = sys.argv[1]

proc_vision = subprocess.Popen(["python server/service/vision.py"], shell=True)

if os.name == 'nt':
    proc_install_ui = subprocess.Popen(["cd client & npm install"], shell=True)
    proc_install_ui.communicate()
    proc_ui = subprocess.Popen(["cd client & au run"], shell=True)
else:
    proc_install_ui = subprocess.Popen(["cd client;npm install"], shell=True)
    proc_install_ui.communicate()
    proc_ui = subprocess.Popen(["cd client;au run"], shell=True)

proc_vision_fake = subprocess.Popen(["python server/service/fakevision.py"], shell=True)
proc_main_api = subprocess.Popen(["python server/main.py" + url], shell=True)

proc_vision_fake.communicate()
proc_vision.communicate()
proc_main_api.communicate()
proc_ui.communicate()
