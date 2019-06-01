const REPLICATION_CONFIGURATION = {
  live: true,
  retry: true,
  heartbeat: true,
  batch_size: 250,
};

export default {
  state: {
    pendingCount: 0,
  },
  reducers: {
    start (currentState, job) {
      return {...currentState, job, lastStartedAt: new Date()};
    },
    update (currentState, information) {
      return {...currentState, lastChangedAt: new Date(), pendingCount: information.pending};
    },
    pause (currentState) {
      return {...currentState, lastPausedAt: new Date()};
    },
    resume (currentState) {
      return {...currentState, lastStartedAt: new Date()};
    },
    crash (currentState) {
      return currentState;
    },
    complete (currentState) {
      return currentState;
    },
  },
  effects (dispatch) {
    return {
      replicate ({from, to}, {database}) {
        return dispatch.replication.start(
          database[to].replicate.from(database[from], REPLICATION_CONFIGURATION)
            // handle change
            .on("change", dispatch.replication.update)
            // replication paused (e.g. replication up to date, user went offline)
            .on("paused", dispatch.replication.pause)
            // replicate resumed (e.g. new changes replicating, user went back online)
            .on("active", dispatch.replication.resume)
            // a document failed to replicate (e.g. due to permissions)
            .on("denied", dispatch.replication.crash)
            // handle complete
            .on("complete", dispatch.replication.complete)
            // handle error
            .on("error", dispatch.replication.crash)
        );
      },
    };
  },
};
