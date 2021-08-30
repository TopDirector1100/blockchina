var currentNet = "ropsten";
var isOnline = false;
var isWarning = false;
var currentAccount = "";
var arrLeaderInfo = [];
var ethItems = [];
var lang = "en";

$(window).on('load', function() {
    if (typeof web3 !== 'undefined') {
        console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
        window.web3 = new Web3(web3.currentProvider);
        window.web3.eth.getTransactionReceiptMined = getTransactionReceiptMined;
        checkNetwork(window.web3);

    } else {
        //console.log('No Web3 Detected... using HTTP Provider')
        window.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/GlEMBFCzgHACj3nE8XY"));
        initMap();
        //console.log('No web3? You should consider trying MetaMask!');
        var warning = '<div class="ui error message"><div class="header">Not Connected</div><div class="content">BlockChina requires a Web3 browser to use like MetaMask</div></div>';
        $(warning).insertAfter(".ui.huge.topbar.menu");
    }
    $('body').on('click', '#localize-langs a', function(e) {
        changeLogoByLang($(this));
    });

    $('body').on('DOMNodeInserted', 'a#localize-current', function(e) {
        html = $("#localize-widget").html();
        html = html.replace(">中文<", ">中文(简体)<");
        $("#localize-widget").html(html);
    });

    changeLogoByLang($("#localize-current"));
});


var getTransactionReceiptMined = function getTransactionReceiptMined(txHash, interval) {
    const self = this;
    const transactionReceiptAsync = function(resolve, reject) {
        self.getTransactionReceipt(txHash, (error, receipt) => {
            if (error) {
                reject(error);
            } else if (receipt == null) {
                setTimeout(
                    () => transactionReceiptAsync(resolve, reject),
                    interval ? interval : 500);
            } else {
                resolve(receipt);
            }
        });
    };

    if (Array.isArray(txHash)) {
        return Promise.all(txHash.map(
            oneTxHash => self.getTransactionReceiptMined(oneTxHash, interval)));
    } else if (typeof txHash === "string") {
        return new Promise(transactionReceiptAsync);
    } else {
        throw new Error("Invalid Type: " + txHash);
    }
};

var nickNameModalInput, ethOnOffLineIcon, nickNameSetButton, nickNameModal, nickNameModalSetButton, txnWarnModal;

$(document).ready(function() {
    nickNameModalInput = $(".modal.nickname>.content>.input>input");
    ethOnOffLineIcon = $('.app >.menu>.right>.icon');
    nickNameSetButton = $('.custom.popup>.ui.button');
    nickNameModal = $('.modal.nickname');
    txnWarnModal = $('.modal.txnwarnning');
    nickNameModalSetButton = nickNameModal.find('.actions>.primary');
    nickNameModalSetButton.on('click', function() {
        if (nickNameModalInput.val().length != 0)
            setNickName(nickNameModalInput.val());
    });
    nickNameModalInput.on('input', function() {
        if (nickNameModalInput.val().length == 0)
            nickNameModalSetButton.addClass('disabled').prop("disabled", true);
        else
            nickNameModalSetButton.removeClass('disabled').prop("disabled", false);
    });
    ethOnOffLineIcon.attr('data-tooltip', 'offline').attr('data-position', 'bottom right');
    nickNameSetButton.click(function() {
        nickNameModal.modal('show');
    });
});

function getNickName(address) {
    return new Promise(function(resolve, reject) {
        var nickNameContract = web3.eth.contract(nickABI);
        var nicks = nickNameContract.at(contractAddress[currentNet]["nicks"]);
        nicks.nickOf(address, function(error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    })
}

function buy(data) {
    if (web3.currentProvider.isMetaMask === true && currentAccount && currentAccount.length > 0) {
        var itemTokenContract = web3.eth.contract(itemTokenABI);
        var ItemToken = itemTokenContract.at(contractAddress[currentNet]["itemToken"]);
        var nextPriceFormat = data.data('nextPrice');
        var nextPrice = web3.toWei(nextPriceFormat, 'ether');
        var itemID = data.data('itemID');
        var dimmer = $('[data-itemID=' + itemID + ']');
        dimmer.dimmer('setting', {
            closable: false,
            on: false
        });
        dimmer.dimmer('show');
        //Buy Item
        ItemToken.buy(itemID, { from: currentAccount, value: nextPrice }, function(error, txnHash) {
            if (!error) {
                if (txnHash) {
                    web3.eth.getTransactionReceiptMined(txnHash, 500).then(function(receipt) {
                        dimmer.modal('hide');
                        location.reload();
                    });
                } else {
                    //TO-DO  pop up error message
                    dimmer.modal('hide');
                    alert("Transaction Fail!!");
                }
            } else {
                dimmer.modal('hide');
                txnWarnModal.modal('show');
            }
        })
    }
}
var contractAddress = {
    "mainnet": {
        "nicks": "0x25470cA21A09e56b4275eeAfba1858A6F3375B28",
        "itemToken": "0x219014EF0FDF1B9b0d4E9e453E021573B7082Bed"
    },
    "testnet": {
        "nicks": "0x1C61D42EFAFe3c627998f2d53D897DBFD99d7fF9",
        "itemToken": "0x61D89828f79BbaEcf854c7dF08dca887aF0f8eE7"
    },
    "ropsten": {
        "nicks": "0x49af9325586819a77b74cf80bc4d2f013ceffe94",
        "itemToken": "0x25470cA21A09e56b4275eeAfba1858A6F3375B28"
    }
};

function priceOf(itemID) {
    return new Promise(function(resolve, reject) {
        var itemTokenContract = web3.eth.contract(itemTokenABI);
        var ItemToken = itemTokenContract.at(contractAddress[currentNet]["itemToken"]);
        ItemToken.priceOf(itemID, function(error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    })
}

function allOf(itemID) {
    return new Promise(function(resolve, reject) {
        var itemTokenContract = web3.eth.contract(itemTokenABI);
        var ItemToken = itemTokenContract.at(contractAddress[currentNet]["itemToken"]);
        ItemToken.allOf(itemID, function(error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    })
}

function ownerOf(itemID) {
    return new Promise(function(resolve, reject) {
        var itemTokenContract = web3.eth.contract(itemTokenABI);
        var ItemToken = itemTokenContract.at(contractAddress[currentNet]["itemToken"]);
        ItemToken.ownerOf(itemID, function(error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    })
}

function formatPrice(price) {

    doublePrice = parseFloat(web3.fromWei(price, 'ether').toString());

    return doublePrice.toFixed(5);
}

function checkNetwork(web3) {
    web3.version.getNetwork((err, netId) => {
        var warning = '<div class="ui error message"><div class="header">Not Connected</div><div class="content">CryptoCountries requires a Web3 browser to use like MetaMask or Mist</div></div>';
        $(".ui.error.message").remove();
        switch (netId) {
            case "1":
                currentNet = "mainnet";
                break
            case "2":
                //deprecated Morden test network
                currentNet = "";
                $(warning).insertAfter(".ui.huge.topbar.menu");
                $(".marketplace").remove();
                $('.modal.warning>.content').html('no confing for network: deprecated Morden test network');
                $('.modal.warning').modal('show');
                break
            case "3":
                //Ropsten tet network
                currentNet = "ropsten";
                warning = '<div class="ui error message"><div class="header">Test Network</div><div class="content">You are using currently on a test network "ropsten".</div></div>';
                $(warning).insertAfter(".ui.huge.topbar.menu");
                break
            case "4":
                //Rinkeby test network
                currentNet = "";
                $(warning).insertAfter(".ui.huge.topbar.menu");
                $(".marketplace").remove();
                $('.modal.warning>.content').html('no confing for network: Rinkeby test network');
                $('.modal.warning').modal('show');
                break
            case "42":
                //Kovan test network
                currentNet = "";
                $(warning).insertAfter(".ui.huge.topbar.menu");
                $(".marketplace").remove();
                $('.modal.warning>.content').html('no confing for network: Kovan test network');
                $('.modal.warning').modal('show');
                break
            default:
                //local test network
                currentNet = "testnet";
                warning = '<div class="ui error message"><div class="header">Not Connected</div><div class="content">You are using currently on a test network </div></div>';
                $(warning).insertAfter(".ui.huge.topbar.menu");

        }
        if (currentNet) {
            startApp();
        }
    })
}


function getNickNameUI() {
    var ethIcon = $('.app >.menu>.right>.item>.icon');
    var ethIconImage = ethIcon.find('.image');
    var nickNameItem = $('.app >.menu>.right>.item');
    var nickNameLabel = $('.app >.menu>.right>.item>.label');
    var bgColor = "#cccccc";
    if( currentAccount.length > 6)
        bgColor = "#" + currentAccount.substr(currentAccount.length - 6);
    nickNameLabel.css('background-color', bgColor);
    getNickName(currentAccount).then(function(result) {
            isOnline = true;
            ethIcon.attr('data-tooltip', 'online').attr('data-position', 'bottom right');
            ethIconImage.attr('src', '../static/media/eth_online.svg');
            //enable set nickname
            nickNameLabel.popup({
                popup: $('.custom.popup'),
                position: 'bottom left',
                delay: {
                    show: 100,
                    hide: 1000
                }
            });

            if (result)
                nickNameLabel.html(result);
            else
                nickNameLabel.html(currentAccount.substr(currentAccount.length - 6));

        })
        .catch(function(error) {
            isOnline = false;
            ethIcon.attr('data-tooltip', 'offline').attr('data-position', 'bottom right');
            ethIconImage.attr('src', '../static/media/eth_offline.svg');
            nickNameLabel.html("");
        });
}

function setNickName(nickname) {
    var nickNameModalDimmer = nickNameModal.find('.dimmer');
    nickNameModalDimmer.dimmer('setting', {
        closable: false,
        on: false,
    });
    nickNameModalDimmer.dimmer('show');
    var nickNameContract = web3.eth.contract(nickABI);
    var nicks = nickNameContract.at(contractAddress[currentNet]["nicks"]);
    nicks.set(nickname, function(error, txnHash) {
        if (!error) {
            if (txnHash) {
                web3.eth.getTransactionReceiptMined(txnHash, 500).then(function(receipt) {
                    location.reload();
                });
            } else {
                nickNameModalDimmer.dimmer('hide');
                alert("Transaction is null");
            }
        } else {
            nickNameModalDimmer.dimmer('hide');
            txnWarnModal.modal('show');
        }
    });
}

function startApp() {
    initUI();
    var refreshAccount = function() {
        if (web3.eth.accounts[0] !== currentAccount) {
            web3.eth.defaultAccount = web3.eth.accounts[0];

            currentAccount = web3.eth.defaultAccount;
            if (!currentAccount || currentAccount.length === 0) {
                var warning = '<div class="ui error message appwarning"><div class="header">Not Connected</div><div class="content">BlockStates requires a Web3 browser to use like MetaMask</div></div>';
                $(warning).insertAfter(".ui.huge.topbar.menu");


            } else {
                $('.ui.error.message.appwarning').remove();

            }
            getNickNameUI();
        }
    };
    refreshAccount();
    var accountInterval = setInterval(refreshAccount, 100);
}

function initMap() {
    function resize() {
        width = parseInt(d3.select("#viz").style("width")),
        width = width - margin.left - margin.right,
        height = width * mapRatio,
        svg.style("width", width + "px").style("height", height + "px"),
        // svg.selectAll(".mainland_svg path .taiwan_svg path").attr("d", path)

        projection
            .scale([width *700 / 840])
            .center([105, 37.5])
            .translate([width / 2, height / 2]);

        d3.selectAll(".mainland_svg path, .taiwan_svg path").attr('d', path);
        d3.select(".map_frame").style("width", width + "px").style("height", height + "px");

        projection1
            .scale([width * 9000 / 840])
            .center([116.1, 23.73])
            .translate([width/2, height/2]);
        d3.selectAll(".hk_macao_svg path").attr('d', path1);

        d3.select(".hk_frame")
            .attr("width", 170 * width/840 + "px")
            .attr("height", 120 * width/840 + "px")
            .attr("x", 0)
            .attr("y", height-120 * width/840)
    }

    function zoomed() {
        features.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")
    }

    var margin = {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        },
    width = parseInt(d3.select("#viz").style("width")),
    width = width - margin.left - margin.right,
    mapRatio = 0.7,
    height = width * mapRatio,
    mapRatioAdjuster = 50;
    
    var region = $('.choose_region').val();
    d3.select(window).on("resize", resize);
    var svg = d3.select("#viz").append("svg").attr("width", width).attr("height", height).attr("border", "1")
    var rect = svg.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", height)
                .attr("width", width)
                .attr("class", "map_frame")
                .style("stroke", "#cccccc")
                .style("fill", "none")
                .style("stroke-width", 1);

    svg.append("rect")
                .attr("width", 170 * width/840 + "px")
                .attr("height", 120 * width/840 + "px")
                .attr("x", 0)
                .attr("y", height-120 * width/840)
                .attr("class", "hk_frame")
                .style("stroke", "#cccccc")
                .style("fill", "none")
                .style("stroke-width", 1);

    // Select Datas source for Region
    json_file = site_url+'dapp/'+region+".json";
    
    var projection = d3.geo.mercator()
                            .scale( width * 700 / 840 )
                            .center([105, 37.5])
                            .translate([width / 2, height / 2]);

    var path = d3.geo.path().projection(projection);

    features = svg.append("g").attr("class", "mainland_svg");;
    d3.json(json_file, function(t, e) 
    {
        if (t) return console.error(t);

        topojson.feature(e, e.objects.units);
        topo_obj = features.selectAll("path")
        .data(topojson.feature(e, e.objects.units).features).enter()
        region_field = "name";

        topo_obj.append("path").attr("d", path)
        .attr("class", function(d){
            return "svg_class_"+finditemIDByCode(d.properties[region_field]);
        })
        .style("fill", "#e8d8c3")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 1.5)
        .on("mouseover", function(t) {
            d3.select("#tooltip").select("#region-price-tooltip").text('');
            d3.select("#tooltip").style("top", d3.event.pageY + 20 + "px")
                .style("left", d3.event.pageX + 20 + "px")
                .select("#region-name-tooltip")
                .text(t.properties[region_field]);

            var itemID = finditemIDByCode(t.properties[region_field]);
            if (itemID >= 0) {

                var currentPrice = 0;
                var currentPriceFormat = formatPrice(currentPrice);
                var ownerAddress = "000000";
                var ownerName = "Locked";

                ethItems.forEach(function(element) {
                    if (element["itemId"] === itemID )
                    {
                        currentPrice = element['nextPrice'];
                        currentPriceFormat = formatPrice(currentPrice);
                        ownerName = element['ownerName'];
                    }
                });

                if( ownerName == "000000")
                    ownerName = "LOCKED";

                d3.select("#tooltip").select("#region-owner-tooltip").text(ownerName);
                d3.select("#tooltip").select("#region-price-tooltip").text(currentPriceFormat + ' ETH');

            } else {
                d3.select("#tooltip").select("#region-price-tooltip")
                    .text('LOCK');
                d3.select("#tooltip").select("#region-owner-tooltip")
                    .text('LOCKED');
            }
            d3.select("#tooltip").classed("hidden", !1);
        })
        .on("mouseout", function() {
            d3.select("#tooltip").classed("hidden", !0);
        })
    });

    /* draw hongkong & macao */
    var projection1 = d3.geo.mercator()
        .scale([width * 9000 / 840])
        .center([116.5, 23.95])

    features1 = svg.append("g").attr("class", "hk_macao_svg");
    var path1 = d3.geo.path().projection(projection1);

    d3.json(site_url+'dapp/hk_macao.json', function(t, e) 
    {
        if (t) return console.error(t);
        topojson.feature(e, e.objects.layer1);
        topo_obj = features1.selectAll("path")
        .data(topojson.feature(e, e.objects.layer1).features).enter()
        region_field = "NAME";

        topo_obj.append("path").attr("d", path1)
        .attr("class", function(d){
            return "svg_class_"+finditemIDByCode(d.properties.NAME);
        })
        .style("fill", "#e8d8c3")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 1.5)
        .on("mouseover", function(t) {
            d3.select("#tooltip").select("#region-price-tooltip").text('');
            d3.select("#tooltip").style("top", d3.event.pageY + 20 + "px")
                .style("left", d3.event.pageX + 20 + "px")
                .select("#region-name-tooltip")
                .text(t.properties.NAME);

            var itemID = finditemIDByCode(t.properties.NAME);
            if (itemID >= 0) {

                var currentPrice = 0;
                var currentPriceFormat = formatPrice(currentPrice);
                var ownerAddress = "000000";
                var ownerName = "Locked";

                ethItems.forEach(function(element) {
                    if (element["itemId"] === itemID )
                    {
                        currentPrice = element['nextPrice'];
                        currentPriceFormat = formatPrice(currentPrice);
                        ownerName = element['ownerName'];
                    }
                });

                if( ownerName == "000000")
                    ownerName = "LOCKED";

                d3.select("#tooltip").select("#region-owner-tooltip").text(ownerName);
                d3.select("#tooltip").select("#region-price-tooltip").text(currentPriceFormat + ' ETH');

            } else {
                d3.select("#tooltip").select("#region-price-tooltip")
                    .text('LOCK');
                d3.select("#tooltip").select("#region-owner-tooltip")
                    .text('LOCKED');
            }
            d3.select("#tooltip").classed("hidden", !1);
        })
        .on("mouseout", function() {
            d3.select("#tooltip").classed("hidden", !0);
        })
    });

    /* draw Taiwan */
    features2 = svg.append("g").attr("class", "taiwan_svg");
    d3.json(site_url+'dapp/taiwan.json', function(t, e) 
    {
        if (t) return console.error(t);

        topojson.feature(e, e.objects.layer1);
        topo_obj = features2.selectAll("path")
        //.data(topojson.feature(e, e.objects.layer1).features)
        .data(topojson.feature(e, e.objects.layer1).features.filter(function(d) { return d.properties.GU_A3 === 'TWN'; }))
        .enter()

        topo_obj.append("path").attr("d", path)
        .attr("class", function(d){
            return "svg_class_"+finditemIDByCode(d.properties.NAME);
        })
        .style("fill", "#e8d8c3")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 1.5)
        .on("mouseover", function(t) {
            d3.select("#tooltip").select("#region-price-tooltip").text('');
            d3.select("#tooltip").style("top", d3.event.pageY + 20 + "px")
                .style("left", d3.event.pageX + 20 + "px")
                .select("#region-name-tooltip")
                .text(t.properties.NAME);

            var itemID = finditemIDByCode(t.properties.NAME);
            if (itemID >= 0) {

                var currentPrice = 0;
                var currentPriceFormat = formatPrice(currentPrice);
                var ownerAddress = "000000";
                var ownerName = "Locked";

                ethItems.forEach(function(element) {
                    if (element["itemId"] === itemID )
                    {
                        currentPrice = element['nextPrice'];
                        currentPriceFormat = formatPrice(currentPrice);
                        ownerName = element['ownerName'];
                    }
                });

                if( ownerName == "000000")
                    ownerName = "LOCKED";

                d3.select("#tooltip").select("#region-owner-tooltip").text(ownerName);
                d3.select("#tooltip").select("#region-price-tooltip").text(currentPriceFormat + ' ETH');

            } else {
                d3.select("#tooltip").select("#region-price-tooltip")
                    .text('LOCK');
                d3.select("#tooltip").select("#region-owner-tooltip")
                    .text('LOCKED');
            }
            d3.select("#tooltip").classed("hidden", !1);
        })
        .on("mouseout", function() {
            d3.select("#tooltip").classed("hidden", !0);
        })
    },function(data) {
        refreshMap();
    });

    /* draw Diaoyutai Island */
    var projection2 = d3.geo.mercator()
                            .scale( width * 200 / 840 )
                            .center([62, 41.4])
                            .rotate([0,45,0])
                            .translate([width / 2, height / 2]);

    features3 = svg.append("g").attr("class", "diaoyutai_svg");
    var path2 = d3.geo.path().projection(projection2);

    d3.json(site_url+'dapp/diaoyutai.json', function(t, e) 
    {
        if (t) return console.error(t);

        topojson.feature(e, e.objects.layer1);
        topo_obj = features3.selectAll("path")
        .data(topojson.feature(e, e.objects.layer1).features.filter(function(d) { return d.properties.GU_A3 === 'DYT'; }))
        .enter()

        topo_obj.append("path").attr("d", path2)
        .attr("class", function(d){
            return "svg_class_"+finditemIDByCode(d.properties.NAME);
        })
        .style("fill", "#e8d8c3")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 1.5)
        .on("mouseover", function(t) {
            d3.select("#tooltip").select("#region-price-tooltip").text('');
            d3.select("#tooltip").style("top", d3.event.pageY + 20 + "px")
                .style("left", d3.event.pageX + 20 + "px")
                .select("#region-name-tooltip")
                .text(t.properties.NAME);

            var itemID = finditemIDByCode(t.properties.NAME);
            if (itemID >= 0) {

                var currentPrice = 0;
                var currentPriceFormat = formatPrice(currentPrice);
                var ownerAddress = "000000";
                var ownerName = "Locked";

                ethItems.forEach(function(element) {
                    if (element["itemId"] === itemID )
                    {
                        currentPrice = element['nextPrice'];
                        currentPriceFormat = formatPrice(currentPrice);
                        ownerName = element['ownerName'];
                    }
                });

                if( ownerName == "000000")
                    ownerName = "LOCKED";

                d3.select("#tooltip").select("#region-owner-tooltip").text(ownerName);
                d3.select("#tooltip").select("#region-price-tooltip").text(currentPriceFormat + ' ETH');

            } else {
                d3.select("#tooltip").select("#region-price-tooltip")
                    .text('LOCK');
                d3.select("#tooltip").select("#region-owner-tooltip")
                    .text('LOCKED');
            }
            d3.select("#tooltip").classed("hidden", !1);
        })
        .on("mouseout", function() {
            d3.select("#tooltip").classed("hidden", !0);
        })
    },function(data) {
        refreshMap();
    });
}

function finditemIDByCode(districtName) {
    var result = -1, arrDistricts = [];
    arrDistricts = districts_chn;

    arrDistricts.forEach(function(element) {
        if (element["code"] === districtName && !element["lock"])
            result = element["itemID"];
    });
    return result;
}

function initCards() {
        var itemTokenContract = web3.eth.contract(itemTokenABI);
        var ItemToken = itemTokenContract.at(contractAddress[currentNet]["itemToken"]);
        var cardsNode = $(".cards");
        arrLeaderInfo = [], arrDistricts = [];
        selected_region = $('.choose_region').val();
        count = 0;
        arrDistricts = districts_chn;

        $('.stackable').html('');
        for (var i = 0; i < arrDistricts.length; i++) {
            (function(v) {
                var itemID = arrDistricts[v]['itemID'];
                ItemToken.allOf(itemID, async function(error, result) {
                    if (!error) {
                        var ownerAddress1 = result[0];
                        var bgColor1 = "#" + ownerAddress1.substr(ownerAddress1.length - 6);
                        var ownerName1 = "";
                        await getNickName(ownerAddress1)
                            .then(function(result) {
                                if (result.length != 0){
                                    ownerName1 = result;
                                }
                                else
                                    ownerName1 = ownerAddress1.substr(ownerAddress1.length - 6);
                            })
                            .catch(function(error) {
                                ownerName1 = ownerAddress1.substr(ownerAddress1.length - 6);
                            });

                        count++;
                        var nextPrice1 = result[2] * 1.01;
                        var nextPriceFormat1 = formatPrice(nextPrice1);
                        var districtName1 = arrDistricts[v]['code'];
                        var objects =  { 'eth': nextPriceFormat1, 'districtName': districtName1, 'ownerName': ownerName1, 'bgColor' : bgColor1, 'itemId': itemID, "nextPrice": nextPrice1};
                        ethItems.push(objects);

                        if( count == arrDistricts.length){
                            var items = ethItems.sort(compare);
                            for (var j=0; j<items.length; j++)
                            {
                                var districtName = items[j]['districtName'];
                                var ownerName = items[j]['ownerName'];
                                var nextPriceFormat = items[j]['eth'];
                                var bgColor = items[j]['bgColor'];
                                var itemId1 = items[j]['itemId'];
                                var nextPrice = items[j]['nextPrice'];

                                var flagURL = site_url+'static/media/province_logos/CN_' + districtName.split(" ").join('') + '.gif';
                                var wikiURL = "https://en.wikipedia.org/wiki/" + districtName.split(" ").join('_') + '';
                                var transactionPending = $('<div class="ui dimmer"><div class="content"><div class="center"><div class="ui text loader">Transaction Pending</div></div></div><!--end content--></div>');
                                transactionPending.attr("data-itemID", itemId1);
                                var cardNode = $('<div></div>').appendTo(cardsNode).addClass("ui card dimmable country-card");
                                cardNode.append(transactionPending);
                                var cardContent = $('<div></div>').addClass('content country-card-bg').css("text-align", "center").css("display", "block");

                                var cardShare = $('<div></div>').addClass('addthis_inline_share_toolbox');

                                var flagImage = $('<img></img>').addClass('ui rounded left floated image')
                                    .attr('src', flagURL).css("height", "40px").css("background", "white");
                                var cardHeader = $('<div></div>').addClass('left aligned header').css("margin-top", "10px")
                                    .html('<a href="' + wikiURL + '" target="_blank">' + districtName + '</a>');
                                cardHeader.append(flagImage);
                                var cardOwner = $('<div></div>').addClass('content country-card-owner')
                                    .css("background-color", bgColor)
                                    .css("color", "rgb(0, 0, 0)");
                                if (arrDistricts[v]['lock'])
                                    cardOwner.css("background-color", "#000000");
                                var string = ownerName.split(" ");
                                var stringArray = new Array();
                                var ownerText = 'Owner: ';

                                if (arrDistricts[v]['lock'] || ownerName=="000000")
                                {
                                    owner = $('<p></p>').html('OWNER: LOCKED').css('font-size', '0.9em').css("letter-spacing", "1").css("word-wrap", "break-word").css("overflow-wrap", "break-word").css("color", "white");
                                    cardOwner.append(owner);
                                    owner = $('<br>').html("").css("line-height", "20px");
                                    cardOwner.append(owner);
                                }
                                else{
                                    for(var i =0; i < string.length; i++) {
                                      if( !string[i].length )
                                        continue;

                                      var tempOwner = string[i];
                                      if (i != 0) {
                                        ownerText = '';
                                      }

                                      var isLink = 0;

                                      if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(tempOwner)) {
                                        isLink = 1;
                                      }

                                      if (isLink == 1) {
                                        owner = $('<span></span>').html(ownerText + '<a href="' + addhttp(tempOwner) + '">' + tempOwner + '</a>').css('font-size', '0.9em').css("letter-spacing", "1").css("margin-top", "25px").css("overflow-wrap", "break-word").css("color", "#fffff");
                                      } else {
                                        owner = $('<span></span>').html(ownerText + '<span>'+tempOwner+'</span>').css('font-size', '0.9em').css("letter-spacing", "1").css("margin-top", "25px").css("word-wrap", "break-word").css("overflow-wrap", "break-word");
                                      }
                                      cardOwner.append(owner);
                                      owner = $('<br>').html("").css("line-height", "20px");
                                      cardOwner.append(owner);
                                    }
                                }

                                var stateImage = $('<div></div>').addClass('content country-state-bg');
                                var imageURL = site_url+'static/media/district/CN_' + districtName.split(" ").join('') + '.png';
                                var districtImage = $('<img></img>').addClass('content_image')
                                     .attr('src', imageURL).css({"height":"250px", "display":"block", "margin":"10px auto","width":"100%"});
                                stateImage.append(districtImage);

                                // get leader infos
                                var mergeFlag = 1;
                                arrLeaderInfo.forEach(function(element) {
                                    if( element['name'] == ownerName ){
                                        element['price'] += parseFloat(nextPrice);
                                        element['regions'].push(itemId1);
                                        element['num_states'] += parseInt(1);
                                        mergeFlag = 0;
                                    }
                                });
                                if( mergeFlag ){
                                    ele = [];
                                    ele["name"] = ownerName;
                                    ele["bgColor"] = bgColor;
                                    ele['price'] = parseFloat(nextPrice);
                                    ele['regions']=[itemId1];
                                    ele['num_states']=1;

                                    arrLeaderInfo.push(ele);
                                }

                                // selector = ".svg_class_" + itemId1;
                                // if( bgColor != "#000000" )
                                //     d3.select(selector).style("fill", bgColor);
                                // else
                                //     d3.select(selector).style("fill", "#cccccc");

                                cardOwner.append(owner);
                                var buyButton = $('<div class="ui large left labeled button" role="button" tabindex="0"><a class="ui basic label">' +
                                    nextPriceFormat + ' ETH</a><button class="ui primary button" role="button">Buy</button></div>');
                                buyButton.data("itemID", itemId1);
                                buyButton.data("nextPrice", nextPriceFormat);
                                buyButton.click(function() {
                                    buy($(this));
                                });

                                var extraContent = $('<div></div>').addClass('center aligned content')
                                    .appendTo($('<div></div>').addClass('extra content'))
                                    .append(buyButton);

                                // cardContent.append(flagImage);
                                cardContent.append(cardHeader);
                                stateImage.append(cardShare);
                                cardContent.append(stateImage);
                                cardNode.append(cardContent);
                                cardNode.append(cardOwner);
                                cardNode.append(extraContent);
                            }
                            initLeaderBoard();
                        }                        
                    } else {
                        console.error(error);
                    }
                });
            })(i);
        }
}

function initLeaderBoard()
{
    $(".leaderboard").html('');
        index = 0;
        
        for(i=0; i<arrLeaderInfo.length; i++)
        {
            for(j=i; j<arrLeaderInfo.length; j++)
            {
                temp = null;
                if( arrLeaderInfo[i]['price'] < arrLeaderInfo[j]['price'])
                {
                    temp = arrLeaderInfo[j];
                    arrLeaderInfo[j] = arrLeaderInfo[i];
                    arrLeaderInfo[i] = temp;
                }
            }
        }

        arrLeaderInfo.forEach(function(element) {

            if(index >= 10 || element.name == "000000" )
                return;
            
            index++;
            width = 35 + (Math.min(arrLeaderInfo.length, 10)-index)*2;
            var leaderboardElement = $('<div></div>').addClass('leaderboard-label').css("font-size", "1.3em");
            var leaderboardElementLabelIndex = $('<div></div>').addClass('leaderboard-label-index')
                                        .css("color", "white")
                                        .css("width", width + "px")
                                        .css("background-color", element.bgColor)
                                        .html(index);
            var leaderboardElementLabelName = $('<div></div>').addClass('leaderboard-label-name').css("text-overflow","ellipsis");
            leaderboardElement.append(leaderboardElementLabelIndex);
            leaderboardElement.append(leaderboardElementLabelName);

            var string = element.name.split(" ");
            var stringArray = new Array();
            var ownerText = '';
            for(var i =0; i < string.length; i++) {
                if( !string[i].length )
                    continue;

                var tempOwner = string[i];
                if (i != 0) 
                    ownerText = '';

                var isLink = 0;
                if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(tempOwner)) {
                    isLink = 1;
                }

                if (isLink == 1)
                    owner = $('<span></span>').html('<a href="' + addhttp(tempOwner) + '">' + ownerText + tempOwner + '</a>').css('font-size', '0.9em').css("letter-spacing", "1").css("margin-top", "25px").css("overflow-wrap", "break-word").css("color", "#fffff");
                else
                    owner = $('<span></span>').html(ownerText + tempOwner).css('font-size', '0.9em').css("letter-spacing", "1").css("margin-top", "25px").css("word-wrap", "break-word").css("overflow-wrap", "break-word");

                leaderboardElementLabelName.append(owner);
                owner = $('<span><span>').html("&nbsp");
                leaderboardElementLabelName.append(owner);
            }
             
            leaderboardElement.on("mouseover", async function(t){
                // display tooltip
                d3.select("#leaderTooltip").style("top", ($(this).offset().top - 45) + "px")
                    .style("left", ($(this).offset().left) + "px")
                    .select("#leader-states-tooltip")
                    .text(element.num_states);

                d3.select("#leaderTooltip").select("#leader-value-tooltip").text(formatPrice(element.price) + ' ETH');
                d3.select("#leaderTooltip").classed("hidden", !1);

                // highlight corresponding districts
                $("path").css("fill", "#e8d8c3");
                element.regions.forEach(function(id){
                    selector = ".svg_class_" + id;
                    d3.select(selector).style("fill", element.bgColor);
                });
            })
            .on("mouseout", function() {
                $(".region-name-container").show();
                d3.select("#leaderTooltip").classed("hidden", !0);
                refreshMap();
            })
            $(".leaderboard").append(leaderboardElement);
        });

    var addthisScript = document.createElement('script');
    addthisScript.setAttribute('src', '//s7.addthis.com/js/250/addthis_widget.js#pubid=ra-5aa8a2375ee07a97&domready=1');
    document.body.appendChild(addthisScript)

    setTimeout(() => {
        refreshMap();
    }, 4000);
}

function refreshMap()
{
    arrLeaderInfo.forEach(function(element) {
        element.regions.forEach(function(id){
            selector = ".svg_class_" + id;
            if( element.bgColor != "#000000" )
                d3.select(selector).style("fill", element.bgColor);
            else
                d3.select(selector).style("fill", "#cccccc");
        });
    });
}

function initUI() {
    //init maps
    initMap();

    //init cards
    initCards();

    // Init leaderboard
    // initLeaderBoard();
}

$('.choose_region').on("change", function(){
    $('#viz').html('');
    initUI();
})

function addhttp(url) {
   if (!/^(f|ht)tps?:\/\//i.test(url)) {
      url = "http://" + url;
   }
   return url;
}

function compare(a, b) {
  const genreA = a.eth;
  const genreB = b.eth;

  let comparison = 0;
  if (genreA < genreB) {
    comparison = 1;
  } else if (genreA > genreB) {
    comparison = -1;
  }
  return comparison;
}

function changeLogoByLang( obj )
{
    var lang = "EN";
    selected_lang = obj.html();
    if( selected_lang == "English" )
        lang = "EN";

    if( selected_lang == "中文(简体)" || selected_lang == "中文" )
        lang = "SC";

    if( selected_lang == "中文(繁體)" )
        lang = "TC";
    
    $("#localize-current").html(selected_lang);
    var image_name = "blockChinaLogo_"+lang+".png";
    $(".logo_image").attr("src", site_url+'static/media/'+ image_name);
}