import rtde_control
import numpy as np
import time
import sys

print("UR_run!!!!!!!!!")
array_to_ur = np.loadtxt('C:\\git\\FRA_503-IOT\\Nodejs\\Processed_image\\'+sys.argv[1]+'ur_array.txt')
# time.sleep(20)

# array_to_ur = np.loadtxt('C:\\git\\FRA_503-IOT\\Nodejs\\Processed_image\\pipogoodur_array.txt')

rtde_c = rtde_control.RTDEControlInterface("192.168.20.35")
z_axis = 0.199 #small magic pen
home_pose = [-0.129, 0.3, 0.252, 3.151, 0, 0]
rtde_c.moveJ_IK(home_pose, 0.5, 0.3)
step = 1
for i in range(array_to_ur.shape[0]):
    if step != array_to_ur[:,2][i]:
        target_pose = [array_to_ur[:,0][i-1], array_to_ur[:,1][i-1], z_axis + 0.03 , 3.151, 0, 0]
        print('step: ', array_to_ur[:,2][i] , target_pose)
        rtde_c.moveJ_IK(target_pose, 1.2, 0.5)

        target_pose = [array_to_ur[:,0][i], array_to_ur[:,1][i], z_axis + 0.03 , 3.151, 0, 0]
        print('step: ', array_to_ur[:,2][i] , target_pose)
        rtde_c.moveJ_IK(target_pose, 1.2, 0.5)

        target_pose = [array_to_ur[:,0][i], array_to_ur[:,1][i], z_axis, 3.151, 0, 0]
        print('step: ', array_to_ur[:,2][i] , target_pose)
        rtde_c.moveJ_IK(target_pose, 1.2, 0.5)

        step = array_to_ur[:,2][i]
    else:
        target_pose = [array_to_ur[:,0][i], array_to_ur[:,1][i], z_axis, 3.151, 0, 0]
        print(target_pose)
        rtde_c.moveJ_IK(target_pose, 1.2, 0.5)
rtde_c.moveJ_IK(home_pose, 0.5, 0.3)
rtde_c.disconnect()

print("UR_finish")
time.sleep(60) ### for changing paper

print("Code finish")