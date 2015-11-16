var app = new Vue({
    el: '#app',
    data: {
        devDependencies: [],
        active: {
            name: null,
            main: [],
            description: null,
            homepage: null,
            license: null,
            version: null
        },
        s: null,
        message: null,
        searchResult: [],
        searchResultShow: 'none'
    },
    methods: {
        showDetail: function(name, version) {
            var self = this;
            $.getJSON('../bower_components/' + name + '/bower.json', function(data) {
                self.active.main = [];
                self.active.name = name;
                self.s = name;

                if (typeof data.main === "string") {
                    self.active.main.push(data.main)
                } else {
                    self.active.main = data.main;
                }
                self.active.version = version.replace('~', '');
                self.active.description = data.description;
                self.active.homepage = data.homepage;
                self.active.license = data.license;
            });
        },
        select: function(name, version) {
            this.showDetail(name, version);
            if (this.searchResultShow === 'block') {
                this.searchResultShow = 'none';
            }
        },
        inputBlur: function() {
            setTimeout(function() {
                this.searchResultShow = 'none';
            }, 500);
        },

        checkUpdate: function() {
            var $btn = $('#checkUpdate').button('loading');
            var self = this;
            $.ajax({
                url: 'index.php',
                type: 'post',
                data: {
                    name: self.active.name,
                    version: self.active.version,
                    action: 'checkupdate'
                },
                success: function(data) {
                    $btn.button('reset');
                }
            });

            //$btn.button('reset')
        },
        search: function() {
            var _this = this;
            if (_this.s !== null) {
                // var search = _.filter(_this.devDependencies, function(v, k) {
                //     console.log(v + ' ' + k);
                //     return k.indexOf(_this.s) !== -1;
                // });
                var search = [];
                _.each(_this.devDependencies, function(v, k) {
                    if(k.indexOf(_this.s)!==-1) {
                        search.push({
                            name: k,
                            version: v
                        });
                    }
                });
                if (search.length === 1) {
                    _this.select(search[0].name, search[0].version);
                } else if (search.length === 0) {
                    _this.searchResult = [];
                    _this.message = '暂无搜索结果，在线搜索中...';
                    // 在线搜索
                    //
                    $.ajax({
                        url: 'index.php',
                        type: 'post',
                        data: {
                            name: _this.s,
                            action: 'search'
                        },
                        success: function(data) {
                            var result = [];
                            _.each(data, function(d, i) {

                                if(i===0) return;
                                var kv = d.split("\ ");
                                console.log(kv);
                                var obj = {};
                                obj[kv[0]] = kv[1];

                                result.push(obj);
                            });

                            console.log(result);
                            _this.searchResult = data;
                        }
                    });
                } else {
                    _this.searchResult = search;

                }
            }

        }
    }
});

$.getJSON('../bower.json', function(data) {
    app.devDependencies = data.devDependencies;
    var temp = [];
    _.each(data.devDependencies, function(v, k) {
        var t = {};
        t.name = k;
        t.version = v;
        // t.version = v.replace('~', '');
        t.install = true;
        temp.push(t);
    });
    app.searchResult = temp;
    setTimeout(function() {
        jQuery(".installed").find('li')[0].click();
    }, 500);
});
