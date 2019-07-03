/* global angular */
angular.module('app.openreq.service.specification', [
]).service('specificationModel', function ($http) {
  const APIVER = 'v0';
  const server = 'http://localhost:5050/api/';
  let data = this,
    URLS = {
      specifications: `specifications/`,
    };
  function extract(result) {
    return result.data;
  }
  function cacheData(result) {
    data = extract(result);
    return data;
  }

  // Services

  data.getSpecifications = () => {
    return $http.get(`${server}${URLS.specifications}`);
  };

  data.getSpecification = (specificationId) => {
    return $http.get(`${server}${URLS.specifications}${specificationId}`);
  };

  data.createSpecification = (specification) => {
    return $http.post(`${server}${URLS.specifications}`, specification);
  };

  data.sendUserInvite = (email, specificationId) => {
    return $http.post(`${server}${URLS.specifications}${specificationId}/invite`, { email });
  };

  data.deleteSpecification = (specificationId) => {
    return $http.delete(`${server}${URLS.specifications}/${specificationId}`);
  }
});