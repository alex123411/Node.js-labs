const {Load} = require('../models/loadModel');
const {badRequestError} = require('../errors')
const {getDriversTruckById, setTruckStatus, getISTrucks} = require('./truckService');
const {getUserRole} = require('./userService');

const getTypeInfo = (truckType) => {
    if (truckType == 'SPRINTER') {
        const sprynter = {
        dimensions: [170 , 250 , 300],
        maxPayload: 1700
        }  
        return  sprynter
    } else if (truckType == 'SMALL STRAIGHT'){
        const small_straight = {
            dimensions: [170 , 250, 500 ],
            maxPayload: 2500
        }
        return  small_straight
    } else {
        const large_straight = {
            dimensions: [200, 350, 700 ],
            maxPayload: 4000
        }
        return  large_straight
    }
}

const getSuitableTruck = (load, trucks) => {
    const loadDimensions = [
      load.width,
      load.length,
      load.height,
    ].sort();
    
    for (const truck of trucks) {
        truckinfo = getTypeInfo(truck.type);
        const maxPayload = truckinfo.maxPayload;
        const truckDimensions = truckinfo.dimensions;
      if (maxPayload <= load.payload) {
        continue;
      }
  
      truckDimensions.sort();
      if (
        loadDimensions[0] <= truckDimensions[0] &&
        loadDimensions[1] <= truckDimensions[1] &&
        loadDimensions[2] <= truckDimensions[2]
      ) {
        

        return truck;
      }
    }
    return null
  };
  

const findDriverTruckId = async (userId) => {
    const truck = await getDriversTruckById(userId);
    
    if (!truck) {
      throw new badRequestError('u don`t have an assigned truck');
    }
  
    return truck._id;
  };
  
const addLogByLoadId = async (loadId, message) => {
    const load = await Load.findById({_id: loadId});

    if (!load) {
        throw new badRequestError('there is no such load');
    }

    load.logs.push({message});

    await load.save();

    return load;
};
  
const getUserLoads = async (userId, offset, limit, status) => {
    const userRole = await getUserRole(userId)
    if (userRole == 'SHIPPER'){
        const loads = await Load.find({created_by: userId})
         .skip(offset)
         .limit(limit);
   
        return loads;
    } else {
        const loads = await Load.find({assignedTo: await findDriverTruckId(userId)})
        .skip(offset)
        .limit(limit);
   
        return loads;
    }
    
}

const addUserLoad = async (userId, loadPayload) => {
    const userRole = await getUserRole(userId)
    if (userRole != 'SHIPPER'){throw new badRequestError('only shipper can add loads!')}
    const load = await new Load({created_by: userId, ...loadPayload});
    await load.save();
}

const getUserActiveLoad = async (userId) => {
    const userRole = await getUserRole(userId)
    if (userRole == 'SHIPPER'){throw new badRequestError('only driver can can get active load!')}
    const load = await Load.findOne({assigned_to: await findDriverTruckId(userId), status: 'ASSIGNED'});
    return load
}

const getActiveLoadByDriverId = async (userId) =>
  Load.findOne({
    assigned_to: await findDriverTruckId(userId),
    status: 'ASSIGNED',
  });

const setLoadStatus = async (id, status) => {
    await Load.findByIdAndUpdate(id, {status});
}

const setLoadState = async (id, state) => {
    await Load.findByIdAndUpdate(id, {state});
}

const iterateLoadState = async (userId) => {
    const userRole = await getUserRole(userId)
    if (userRole == 'SHIPPER'){throw new badRequestError('only driver can can get active load!')}
    const load = await getActiveLoadByDriverId(userId);
    console.log(load)
    const state = load.state
    if (!load) {
        throw new badRequestError('You don`t have an active load');
    }
    const states = [
        'En route to Pick Up', 
        'Arrived to Pick Up', 
        'En route to delivery', 
        'Arrived to delivery', 
    ];
    let nextState = 'Arrived to delivery';
    if (state === states[2]) { 
        await setTruckStatus(userId, 'IS');
        await setLoadStatus(load._id, 'SHIPPED');
        await addLogByLoadId(load._id, `Load status changed to 'SHIPPED'`);
    } else { 
        if (state === states[0]) {
            nextState = states[1];
        } else if (state === states[1]) {
            nextState = states[2];
        } 
    }

    await setLoadState(load._id, nextState);
    await addLogByLoadId(load._id, `Load state changed to '${nextState}'`);

    return nextState
    
    

}


const assignLoadWithTruck = async (id, assigned_to) => {
    await Load.findByIdAndUpdate(id , {assigned_to});
}

const postUserLoadById = async (shipperId, loadId) => {
    const userRole = await getUserRole(shipperId)
    if (userRole != 'SHIPPER'){throw new badRequestError('only shipper can do this!')}
    console.log(loadId)
    const load = await Load.findOne({_id: loadId, created_by: shipperId});

    if (!load) {
        throw new badRequestError('There is no load with such id!');
    }

    if (load.status != 'NEW' && load.status != 'POSTED') {
        throw new badRequestError(
            `Load with '${load.status}' status cannot be posted`,
        );
    }

    await setLoadStatus(loadId, 'POSTED');
    await addLogByLoadId(loadId, "Load status changed to 'POSTED'");

    const freeTrucks = await getISTrucks();

    const truck = getSuitableTruck(load.dimensions, freeTrucks);

    let driverFound = true;
    if (truck === null) {
        driverFound = false;
        await setLoadStatus(loadId, 'NEW');
        await addLogByLoadId(loadId, `Load status changed to 'NEW'`);
    } else {
        await setTruckStatus(truck._id, 'OL');
        await assignLoadWithTruck(loadId, truck._id);
        await addLogByLoadId(
            loadId,
            `Load assigned to driver with id ${truck.assignedTo}`,
        );

        await setLoadState(loadId, 'En route to Pick Up');
        await setLoadStatus(loadId, 'ASSIGNED')
        await addLogByLoadId(loadId, `Load state changed to 'En route to Pick Up'`);
    }

    return driverFound

}


module.exports = {
    getUserLoads,
    addUserLoad,
    getUserActiveLoad,
    iterateLoadState,
    postUserLoadById
};