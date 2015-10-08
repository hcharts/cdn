var app = new Vue({
    el: '#app',
    data: {
        devDependencies: [],
        main: [],
        active: null,
        s: null,
        searchResult: [],
        searchResultShow: 'none'
    },
    methods: {
        showDetail: function(name) {
            var self = this;
            $.getJSON('../bower_components/' + name + '/bower.json', function(data) {
                self.main = [];
                self.active = name;
                if (typeof data.main === "string") {
                    self.main.push(data.main)
                } else {
                    self.main = data.main;
                }
            });
        },
        select: function(name)  {
            this.active = name;
            if(this.searchResultShow==='block') {
                this.searchResultShow = 'none';
            }
        },
        inputBlur: function() {
            setTimeout(function() {
                this.searchResultShow = 'none';
            },500);
        },
        search: function() {
            // var self = this;
            // var fined = _.find(this.devDependencies, function(v, k) {
            //     return k === self.s;
            // });

            // if(fined) {
            //     this.active = fined;
            // }
        }
    }
});

$.getJSON('../bower.json', function(data) {
    app.devDependencies = data.devDependencies;
    var temp = [];
    _.each(data.devDependencies, function(v, k) {
        var t = {};
        t.name = k;
        t.version = v.replace('~', '');
        t.install = true;
        temp.push(t);
    });
    app.searchResult = temp;
    setTimeout(function() {
        jQuery(".installed").find('li')[0].click();
    }, 500);
});