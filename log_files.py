logs = [
    ["58523", "user_1", "resource_1"],
    ["62314", "user_2", "resource_2"],
    ["54001", "user_1", "resource_3"],
    ["215", "user_6", "resource_4"],
    ["200", "user_6", "resource_5"],    
    ["54060", "user_2", "resource_3"],
    ["53941", "user_3", "resource_3"],
    ["58522", "user_4", "resource_1"],
    ["53651", "user_5", "resource_3"],
    ["2", "user_6", "resource_3"],
    ["100", "user_6", "resource_6"],
    ["400", "user_7", "resource_2"],
    ["100", "user_8", "resource_2"],
]

def sortLogs(logs):
    usersToTimes = {}
    for time, userId, resourceId in logs:
        time = int(time)
        if userId not in usersToTimes:
            usersToTimes[userId] = [time, time]
        else:
            if usersToTimes[userId][0] > time:
                usersToTimes[userId][0] = time
            
            if usersToTimes[userId][1] < time:
                usersToTimes[userId][1] = time
        
    return usersToTimes

# print(sortLogs(logs))

def mostUsedResource(logs):
    logs = sorted(logs, key=lambda x: int(x[0]))
    
    resourcesToTimes = {}
    
    for time, _, resource in logs:
        if resource not in resourcesToTimes:
            resourcesToTimes[resource] = []
        resourcesToTimes[resource].append(int(time))
        
    maxCount = 0
    maxResource = None
    for resource in resourcesToTimes.keys():
        # check first and see how many are in window of 300
        times = resourcesToTimes[resource]
        for idx in range(0, len(times)):
            initialTime = times[idx]
            
            for checkIdx in range(idx, len(times)):
                checkTime = times[checkIdx]
                if checkTime > initialTime + 300:
                    checkTime -= 1
                    break

            count = checkIdx - idx + 1
            if count > maxCount:
                maxCount = count
                maxResource = resource


    return maxResource, maxCount
    
# print(mostUsedResource(logs))


def probabilities(logs):
    logs = sorted(logs, key=lambda x: int(x[0]))
    
    usersToOrderedResources = {}
    
    for _, user, resource in logs:
        if user not in usersToOrderedResources:
            usersToOrderedResources[user] = ['__START__']
        usersToOrderedResources[user].append(resource)
        
    resourcesToNext = {}
    
    for user in usersToOrderedResources:
        resources = usersToOrderedResources[user]
        resources.append('__END__')
        
        for idx in range(0, len(resources) - 1):
            origin = resources[idx]
            destination = resources[idx + 1]
            if origin not in resourcesToNext:
                resourcesToNext[origin] = {}
                
            resourceMap = resourcesToNext[origin]
            if destination not in resourceMap:
                resourceMap[destination] = 0
            resourceMap[destination] += 1
        
    
    for resource in resourcesToNext:
        nexts = resourcesToNext[resource]
        
        total = sum(nexts.values())
        
        for nextResource in nexts:
            nexts[nextResource] = nexts[nextResource] * 1.0 / total
            
    return resourcesToNext
    
print(probabilities(logs))