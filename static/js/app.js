var currentNet = "ropsten";
var currentAccount = "";
$(window).on('load', function() {
    if (typeof web3 !== 'undefined') {
        console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
        window.web3 = new (web3.currentProvider);
        checkNetwork(window.web3);
    } else {
        //console.log('No Web3 Detected... using HTTP Provider')
        window.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/GlEMBFCzgHACj3nE8XY"));
    }
    $('body').on('click', '#localize-langs a', function(e) {
        changeLogoByLang( $(this));
    });

    $('body').on('DOMNodeInserted', 'a#localize-current', function(e) {
        html = $("#localize-widget").html();
        html = html.replace(">中文<", ">中文(简体)<");
        $("#localize-widget").html(html);
    });

    changeLogoByLang($("#localize-current"));
});

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

function checkNetwork(web3) {
    web3.version.getNetwork((err, netId) => {

        switch (netId) {
            case "1":
                currentNet = "mainnet";
                break
            case "2":
                //deprecated Morden test network
                currentNet = "";

                break
            case "3":
                //Ropsten tet network
                currentNet = "ropsten";
                break
            case "4":
                //Rinkeby test network
                currentNet = "";
                break
            case "42":
                //Kovan test network
                currentNet = "";
                break
            default:
                //local test network
                currentNet = "testnet";

        }
        if (currentNet) {
            startApp();
        }
    })
}

function startApp() {
    var ethIcon = $('.app >.menu>.right>.item>.icon');
    var ethIconImage = ethIcon.find('.image');
    ethIcon.attr('data-tooltip', 'offline').attr('data-position', 'bottom right');
    ethIconImage.attr('src', site_url+'static/media/eth_offline.svg');
    var refreshAccount = function() {
        if (web3.eth.accounts[0] !== currentAccount) {
            web3.eth.defaultAccount = web3.eth.accounts[0];

            currentAccount = web3.eth.defaultAccount;
            if (!currentAccount || currentAccount.length === 0) {
                ethIcon.attr('data-tooltip', 'offline').attr('data-position', 'bottom right');
                ethIconImage.attr('src', site_url+'static/media/eth_offline.svg');
            } else {
                ethIcon.attr('data-tooltip', 'online').attr('data-position', 'bottom right');
                ethIconImage.attr('src', site_url+'static/media/eth_online.svg');
            }
        }
    };
    refreshAccount();
    var accountInterval = setInterval(refreshAccount, 100);
}