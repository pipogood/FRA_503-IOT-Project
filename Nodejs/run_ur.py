import rtde_control
import rtde_receive
import numpy as np
import time
import sys

print("UR_run!!!!!!!!!")
array_to_ur = np.loadtxt('C:\\git\\FRA_503-IOT\\Nodejs\\Processed_image\\'+sys.argv[1]+sys.argv[2]+'ur_array.txt')
# time.sleep(50)

rtde_c = rtde_control.RTDEControlInterface("192.168.20.35")
rtde_r = rtde_receive.RTDEReceiveInterface("192.168.20.35")

home_pose = [-0.129, 0.3, 0.252, 3.151, 0, 0]
rtde_c.moveJ_IK(home_pose, 0.5, 0.3)

z_axis = 0.2085

step = 1

for i in range(array_to_ur.shape[0]):
    if step != array_to_ur[:,2][i]:  
        #ยกปลายแขนขึ้นเพื่อวาดจุดต่อไป
        target_pose = [array_to_ur[:,0][i-1], array_to_ur[:,1][i-1], z_axis + 0.03 , 3.151, 0, 0]
        print('step: ', array_to_ur[:,2][i] , target_pose)
        rtde_c.moveJ_IK(target_pose, 1.2, 0.5)

        #เคลื่อนไปยังจุดต่อไป
        target_pose = [array_to_ur[:,0][i], array_to_ur[:,1][i], z_axis + 0.03 , 3.151, 0, 0]
        print('step: ', array_to_ur[:,2][i] , target_pose)
        rtde_c.moveJ_IK(target_pose, 1.2, 0.5)
        print('before contact paper: ', rtde_r.getActualTCPForce()[2])
        before_contact = rtde_r.getActualTCPForce()[2]

        #เอาแขนลง
        target_pose = [array_to_ur[:,0][i], array_to_ur[:,1][i], z_axis, 3.151, 0, 0]
        print('step: ', array_to_ur[:,2][i] , target_pose)
        rtde_c.moveJ_IK(target_pose, 1.2, 0.5)
        print('after contact paper: ', rtde_r.getActualTCPForce()[2])
        after_contact = rtde_r.getActualTCPForce()[2]
        print('Different_force', after_contact - before_contact)

        if after_contact - before_contact < 0.3:
            target_pose = [array_to_ur[:,0][i], array_to_ur[:,1][i], z_axis - 0.0005, 3.151, 0, 0]
            rtde_c.moveJ_IK(target_pose, 1.2, 0.5)
        elif after_contact - before_contact > 0.7:
            target_pose = [array_to_ur[:,0][i], array_to_ur[:,1][i], z_axis + 0.0005, 3.151, 0, 0]
            rtde_c.moveJ_IK(target_pose, 1.2, 0.5)

        step = array_to_ur[:,2][i]
    else: #ให้ปลายแขนเคลื่อนที่ไปตามจุด target point เรื่อยๆ
        target_pose = [array_to_ur[:,0][i], array_to_ur[:,1][i], z_axis, 3.151, 0, 0]
        # print(target_pose)
        rtde_c.moveJ_IK(target_pose, 1.2, 0.5)

rtde_c.moveJ_IK(home_pose, 0.5, 0.3)
rtde_c.disconnect()
rtde_r.disconnect()
print("UR_finish")
time.sleep(60) ### for changing paper

print("Code finish")