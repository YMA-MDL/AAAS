/* global angular */
angular.module('app.openreq.service.requirement', [
]).service('requirementModel', function ($http) {
  const APIVER = 'v0';
  const server = 'http://localhost:5050/api/';
  let data = this,
    URLS = {
      requirements: `requirements`,
    };
  function extract(result) {
    return result.data;
  }
  function cacheData(result) {
    data = extract(result);
    return data;
  }

  // Services

  data.getRequirements = (specificationId) => {
    return $http.get(`${server}${URLS.requirements}/${specificationId}`);
  };

  data.getRequirement = (specificationId, requirementId) => {
    return $http.get(`${server}${URLS.requirements}/${specificationId}/${requirementId}`);
  };

  data.createRequirement = (specificationId, params) => {
    return $http.post(`${server}${URLS.requirements}/${specificationId}`, params);
  }

  data.updateRequirement = (specificationId, requirementId, params) => {
    return $http.put(`${server}${URLS.requirements}/${specificationId}/${requirementId}`, params);
  }

  data.deleteRequirement = (specificationId, requirementId) => {
    return $http.delete(`${server}${URLS.requirements}/${specificationId}/${requirementId}`);
  }
});