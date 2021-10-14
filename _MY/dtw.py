import mlpy
import matplotlib.pyplot as plt
import matplotlib.cm as cm

#Input the two data sequencs to array a and b

a = []
b = []


dist, cost, path = mlpy.dtw_std(a, b, dist_only=False)

print("Distance between a and b temporal sequneces")
print(dist)
print("############")


plt.figure("Two temporal sequnences")
plt.plot(a)
plt.plot(b)

fig = plt.figure("Accumulated Cost Matrix & warping path")
ax = fig.add_subplot("ACM & WP")
plot1 = plt.imshow(cost.T, origin='lower', cmap=cm.plasma,
                   interpolation='nearest')
plot2 = plt.plot(path[0], path[1], 'w')
xlim = ax.set_xlim((-0.5, cost.shape[0]-0.5))
ylim = ax.set_ylim((-0.5, cost.shape[1]-0.5))


plt.show()
