<?php
    include("../static/header.php");
?>
    <div id="tooltip" class="hidden tooltip">
        <div class="region-name-container"><strong>Region:</strong> <span id="region-name-tooltip">100</span></div>
        <div><strong>Current Price:</strong> <span id="region-price-tooltip">200</span></div>
        <div><strong>Owner:</strong> <span id="region-owner-tooltip"></span></div>
    </div>
    <div id="leaderTooltip" class="hidden tooltip">
        <div class="region-name-container"><strong>Provinces:</strong> <span id="leader-states-tooltip"></span>,
        <strong>Value:</strong> <span id="leader-value-tooltip"></span></div>
    </div>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root">
        <div class="content">
            <div class="ui container app">
                <div class="ui huge topbar menu">
                    <a class="item active" aria-current="true" href="<?php echo $doc_root;?>" style="padding-left: 0px;">
                        <div class="ui"><img src="../static/media/blockChinaLogo_EN.png" class="ui image logo_image" style="width: 300px; height: auto;" />
                        </div>
                    </a>
                    <div class="right menu">
                        <select class="active item choose_region" style="text-transform: uppercase; border:none; display: none;">
                            <option value="CHN" selected="selected">China</option>
                        </select>
                        <a class="active item" href="<?php echo $doc_root;?>dapp" style="text-transform: uppercase;">Marketplace</a>
                        <div class="item">
                            <div class="ui label" style="margin-left: 0px;"></div>
                            <div class="ui custom popup bottom right transition hidden">
                                <button class="ui button">
                                    Set Nickname
                                </button>
                            </div>
                        </div>
                        
                        <div class="item"> <div class="icon"><img src="../static/media/eth_offline.svg" class="ui image" style="width: 35px; height: 35px;" data-tooltip="Add users to your feed" data-position="bottom left"></div></div>
                    </div>
                </div>
            
                <div class="marketplace">
                    <span>
                        <h1 class="ui aligned header">Marketplace</h1>
                        <h3 class="ui selected_region" style="text-transform: uppercase;">Region: China</h3>
                        <div class="ui basic segment" style="padding: 0px;">
                            <div class="ui two column grid">
                                <div class="four wide column leaderboard" style="padding-left: 0px;">
                                </div>
                                <div class="twelve wide column" style="padding-left: 0px;">
                                    <div id="viz"></div>
                                </div>                                
                            </div>
                        </div>
                        <div class="ui basic segment" style="padding: 0px;">
                            <div class="ui stackable four cards">
                                <!--end span-->
                            </div>
                        </div>
                    </span>
                </div>
                <!--end marketplace-->
            </div>
        </div>
        <?php
            include("../static/footer.php");
        ?>
        <div class="ui small modal warning" style="margin-top: -95px;">
            <div class="ui header"><i aria-hidden="true" class="warning sign icon"></i> Error</div>
            <div class="content"></div>
            <div class="actions">
                <button class="ui cancel button" role="button">Close</button>
            </div>
        </div>
        <div class="ui small modal txnwarnning" style="margin-top: -95px;">
            <div class="ui header"><i aria-hidden="true" class="warning sign icon"></i> Error</div>
            <div class="content">MetaMask Tx Signature: User denied transaction signature.</div>
            <div class="actions">
                <button class="ui cancel button" role="button">Close</button>
            </div>
        </div>
        <div class="ui small modal nickname" style="margin-top: -104px;">
            <div class="ui inverted dimmer">
                <div class="content">
                    <div class="center">
                        <div class="ui text loader">Waiting on Transaction ...</div>
                    </div>
                </div>
            </div>
            <div class="ui header"><i aria-hidden="true" class="user icon"></i> Set Nickname</div>
            <div class="content">
                <div class="ui error fluid input">
                    <input type="text" value="" placeholder="Nickname">
                </div>
            </div>
            <div class="actions">
                <button class="ui button cancel" role="button">Cancel</button>
                <button class="ui primary disabled button" disabled="" role="button" tabindex="-1">Ok</button>
            </div>
        </div>
        <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
        <script src="../static/js/semantic.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js"></script>
        <script src="https://d3js.org/topojson.v1.min.js"></script>
        <script src="https://d3js.org/queue.v1.min.js"></script>
        
        <script src="https://d3js.org/d3-geo-projection.v1.min.js"></script>
        <script type="text/javascript" src="../static/js/web3.min.js"></script>
        <script type="text/javascript" src="../static/js/myABI.js"></script>
        <script type="text/javascript" src="../static/js/myLocations.js"></script>
        <script type="text/javascript" src="../static/js/main.js"></script>
<!-- Go to www.addthis.com/dashboard to customize your tools --> <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5aa8a2375ee07a97"></script>
</body>
</html>