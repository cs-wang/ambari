/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. The ASF
 * licenses this file to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

var App = require('app');

/**
 * Base class for any HDFS metric.
 */
App.MainChartHeatmapDFSMetrics = App.MainChartHeatmapMetric.extend({
  metricUrlTemplate: "/clusters/{clusterName}/services/HDFS/components/DATANODE?fields=host_components/{metricName}",

  /**
   * Custom mapper for DFS metrics
   */
  metricMapper: function (json) {
    var hostToValueMap = {};
    var metricName = this.get('defaultMetric');
    if (json.host_components) {
      var props = metricName.split('.');
      transformValueFunction = this.get('transformValue');
      json.host_components.forEach(function (hc) {
        var value = hc;
        props.forEach(function (prop) {
          value = value[prop];
        });

        if (transformValueFunction) {
          value = transformValueFunction(value);
        }

        var hostName = hc.HostRoles.host_name;
        hostToValueMap[hostName] = value;
      });
    }
    return hostToValueMap;
  },

  /**
   * Utility function which allows extending classes to transform the value
   * assigned to a host.
   * 
   * @type Function
   */
  tranformValue: null
});