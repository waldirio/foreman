import {
  VMWARE_CLUSTER_CHANGE,
  STORAGE_VMWARE_ADD_CONTROLLER,
  STORAGE_VMWARE_ADD_DISK,
  STORAGE_VMWARE_REMOVE_CONTROLLER,
  STORAGE_VMWARE_UPDATE_CONTROLLER,
  STORAGE_VMWARE_REMOVE_DISK,
  STORAGE_VMWARE_UPDATE_DISK,
  STORAGE_VMWARE_INIT,
  STORAGE_VMWARE_DATASTORES_REQUEST,
  STORAGE_VMWARE_DATASTORES_SUCCESS,
  STORAGE_VMWARE_DATASTORES_FAILURE,
  STORAGE_VMWARE_STORAGEPODS_REQUEST,
  STORAGE_VMWARE_STORAGEPODS_SUCCESS,
  STORAGE_VMWARE_STORAGEPODS_FAILURE,
} from '../../../consts';
import {
  defaultControllerAttributes,
  getDefaultDiskAttributes,
} from './vmware.consts';
import { ajaxRequestAction } from '../../common';

export const updateDisk = (key, newValues) => ({
  type: STORAGE_VMWARE_UPDATE_DISK,
  payload: {
    key,
    newValues,
  },
});

export const initController = (
  config,
  cluster,
  controllers,
  volumes
) => dispatch => {
  dispatch({
    type: STORAGE_VMWARE_INIT,
    payload: {
      config,
      controllers: controllers || defaultControllerAttributes,
      volumes: volumes || getDefaultDiskAttributes,
      cluster,
    },
  });
  dispatch(fetchDatastores(config.datastoresUrl, cluster));
  dispatch(fetchStoragePods(config.storagePodsUrl, cluster));
};

export const changeCluster = newCluster => (dispatch, getState) => {
  const { config } = getState().hosts.storage.vmware;

  dispatch({
    type: VMWARE_CLUSTER_CHANGE,
    payload: {
      cluster: newCluster,
    },
  });
  dispatch(fetchDatastores(config.datastoresUrl, newCluster));
  dispatch(fetchStoragePods(config.storagePodsUrl, newCluster));
};

const fetchStorages = (url, cluster = null, actions = {}) => dispatch => {
  if (cluster) {
    ajaxRequestAction({
      dispatch,
      ...actions,
      url,
      item: { params: { cluster_id: cluster } },
    });
  }
};

export const fetchDatastores = (url, cluster = null) =>
  fetchStorages(url, cluster, {
    requestAction: STORAGE_VMWARE_DATASTORES_REQUEST,
    successAction: STORAGE_VMWARE_DATASTORES_SUCCESS,
    failedAction: STORAGE_VMWARE_DATASTORES_FAILURE,
  });

export const fetchStoragePods = (url, cluster = null) =>
  fetchStorages(url, cluster, {
    requestAction: STORAGE_VMWARE_STORAGEPODS_REQUEST,
    successAction: STORAGE_VMWARE_STORAGEPODS_SUCCESS,
    failedAction: STORAGE_VMWARE_STORAGEPODS_FAILURE,
  });

export const addController = data => ({
  type: STORAGE_VMWARE_ADD_CONTROLLER,
  payload: {
    controller: defaultControllerAttributes,
    volume: getDefaultDiskAttributes,
  },
});

export const updateController = (idx, newValues) => ({
  type: STORAGE_VMWARE_UPDATE_CONTROLLER,
  payload: {
    idx,
    newValues,
  },
});

export const removeDisk = key => ({
  type: STORAGE_VMWARE_REMOVE_DISK,
  payload: {
    key,
  },
});

export const removeController = controllerKey => ({
  type: STORAGE_VMWARE_REMOVE_CONTROLLER,
  payload: { controllerKey },
});

export const addDisk = controllerKey => ({
  type: STORAGE_VMWARE_ADD_DISK,
  payload: {
    controllerKey,
    data: getDefaultDiskAttributes,
  },
});
