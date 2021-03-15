const input = [
  ["58523", "user_1", "resource_1"],
  ["62314", "user_2", "resource_2"],
  ["54001", "user_1", "resource_3"],
  ["200", "user_6", "resource_5"],
  ["215", "user_6", "resource_4"],
  ["54060", "user_2", "resource_3"],
  ["53760", "user_3", "resource_3"],
  ["58522", "user_4", "resource_1"],
  ["53651", "user_5", "resource_3"],
  ["2", "user_6", "resource_1"],
  ["100", "user_6", "resource_6"],
  ["400", "user_7", "resource_2"],
  ["100", "user_8", "resource_2"],
  ["54359", "user_1", "resource_3"],
  ]
  
function checkLogs(logList) {
  const userTimestamps = {};
  for (let i = 0; i < logList.length; i++) {
    let log = logList[i];
    if (!(log[1] in userTimestamps)) {
      userTimestamps[log[1]] = [parseInt(log[0]), parseInt(log[0])];
    } else {
      if (parseInt(log[0]) < userTimestamps[log[1]][0]) {
        userTimestamps[log[1]][0] = parseInt(log[0])
      } else if (parseInt(log[0]) > userTimestamps[log[1]][1]) {
        userTimestamps[log[1]][1] = parseInt(log[0]);
      }
    }
  }
  return userTimestamps;
}

function accessTimes(logList) {
let logs = logList
  .map(data => {
    const [time, ...rest] = data;
    return [parseInt(time), ...rest]
  }).sort((a, b) => a[0] - b[0]);
  let pointer = 0, frequency = {}, maxInstances = Number.NEGATIVE_INFINITY, maxResource = '';
  for (let i = 0; i < logs.length; i++) {
    const [timestamp, , resource] = logs[i];
    let [timestampTemp, , resourceTemp] = logs[pointer];
    let timeDiff = timestamp - timestampTemp;
    let isMoreThan5Min = timeDiff > 300;
    frequency[resource] = (frequency[resource] || 0) + 1;
    if (frequency[resource] > maxInstances && !isMoreThan5Min) {
      maxInstances = frequency[resource];
      maxResource = resource;
    }
    // console.log({i, pointer, frequency, maxInstances, timestampTemp, timestamp})
    while (isMoreThan5Min) {
      frequency[resourceTemp]--;
      pointer++;
      [timestampTemp, , resourceTemp] = logs[pointer];
      timeDiff = timestamp - timestampTemp;
      isMoreThan5Min = timeDiff > 300;
    }       
  }
  return [maxResource, maxInstances];
}

function probabilities(log_list) {
  // sort logs by time
  let logs = log_list
  .map(data => {
    const [time, ...rest] = data;
    return [parseInt(time), ...rest]
  }).sort((a, b) => a[0] - b[0]);
  const usersToResources = {};
  // build obj showing the resource(s) logged by each user
  for (let i = 0; i < logs.length; i++) {
    const [ , user, resource] = logs[i];
    if (!(usersToResources[user])) { 
      usersToResources[user] = ["__START__"];
    }
    usersToResources[user].push(resource);
  }
  const resourcesToNext = {};
  for (user in usersToResources) {
    const resources = usersToResources[user];
    resources.push("__END__");
    // build obj showing how many times a particular resource (destination) follows a given resource (origin)
    for (let i = 0; i < resources.length - 1; i++) {
      const origin = resources[i], destination = resources[i + 1];
      // the value of this obj is a map 
      if (!(resourcesToNext[origin])) {
        resourcesToNext[origin] = {};
      } 
      const resourceMap = resourcesToNext[origin];
      // add to the count of the destination resource every time it follows another resource
      resourceMap[destination] = (resourceMap[destination] || 0) + 1;
    }
  };
  // convert numbers to probabilities
  for (resource in resourcesToNext) {
    const nextResources = resourcesToNext[resource];
    // count how many times any resource follows the key resouce
    const total = Object.values(nextResources).reduce((a, b) => a + b, 0);
    for (nextResource in nextResources) {
      // rest from integer to probability
      nextResources[nextResource] = nextResources[nextResource] / total;
    }
  }
  return resourcesToNext;
}

console.log(checkLogs(input));
console.log(accessTimes(input));
console.log(probabilities(input));