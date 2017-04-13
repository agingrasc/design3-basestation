class Tasks:
    def __init__(self):
        self._tasks = {
            "initial_orientation": False,
            "identifie_antenna": False,
            "receive_informations": False,
            "go_to_image": False,
            "take_picture": False,
            "go_to_drawing_zone": False,
            "draw_image": False,
            "go_out_of_drawing_zone": False,
            "light_red_led": False
        }

    def mark_done(self, task_id):
        if task_id in self._tasks:
            self._tasks[task_id] = True

    def reset_all(self):
        for task_id in self._tasks:
            self._tasks[task_id] = False

    def to_dto(self):
        tasks_dto = {}
        for task_id in self._tasks:
            tasks_dto[task_id] = str(self._tasks[task_id])
        return {"data": tasks_dto}
