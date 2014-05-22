'use strict';

angular.module('winifySiteServices', [])
  .provider('getSearchKey', function() {
    this.blocks = [];
  
    this.setBlocks = function(blocks) {
      this.blocks = blocks;
    };
    
    this.$get = ['$location', function($location) {
        var search = $location.search() || {};

        return (function(b, s) {
          var i = 0, l = b.length;
          for (i; i < l; i++) {
            if (b[i] in s) {
              return b[i];
            }
          }
          return false;
        })(this.blocks, search);
      }];
  });