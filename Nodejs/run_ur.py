import rtde_control
import numpy as np

array_to_ur = np.loadtxt('C:\\git\\FRA_503-IOT\\Nodejs\\Processed_image\\ur_array.txt')

# rtde_c = rtde_control.RTDEControlInterface("192.168.20.35")
# z_axis = 0.208 #small magic pen
# home_pose = [-0.129, 0.3, 0.252, 3.151, 0, 0]
# rtde_c.moveJ_IK(home_pose, 0.5, 0.3)
# step = 1
# for i in range(array_to_ur.shape[0]):
#     # if array_to_ur[:,2][i] <= 2:
#     if step != array_to_ur[:,2][i]:
#         target_pose = [array_to_ur[:,0][i-1], array_to_ur[:,1][i-1], z_axis + 0.03 , 3.151, 0, 0]
#         print('step: ', array_to_ur[:,2][i] , target_pose)
#         rtde_c.moveJ_IK(target_pose, 1.0, 0.1)

#         target_pose = [array_to_ur[:,0][i], array_to_ur[:,1][i], z_axis + 0.03 , 3.151, 0, 0]
#         print('step: ', array_to_ur[:,2][i] , target_pose)
#         rtde_c.moveJ_IK(target_pose, 1.0, 0.1)

#         target_pose = [array_to_ur[:,0][i], array_to_ur[:,1][i], z_axis, 3.151, 0, 0]
#         print('step: ', array_to_ur[:,2][i] , target_pose)
#         rtde_c.moveJ_IK(target_pose, 1.0, 0.1)

#         step = array_to_ur[:,2][i]
#     else:
#         target_pose = [array_to_ur[:,0][i], array_to_ur[:,1][i], z_axis, 3.151, 0, 0]
#         print(target_pose)
#         rtde_c.moveJ_IK(target_pose, 1.0, 0.1)
# rtde_c.moveJ_IK(home_pose, 0.5, 0.3)
# rtde_c.disconnect()