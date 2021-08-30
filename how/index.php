<?php
    include("../static/header.php");
?>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root">
        <div class="content">
            
            <div class="site pattern">
                <div class="ui container app">
                <div class="ui huge topbar menu">
                    <a class="item active" aria-current="true" href="<?php echo $doc_root;?>" style="padding-left: 0px;">
                        <div class="ui image"><img src="../static/media/blockChinaLogo_EN.png logo_image" class="ui image" style="width: 300px; height: auto;" />
                        </div>
                    </a>
                    <div class="right menu">
                        <a class="active item" href="<?php echo $doc_root;?>dapp" style="text-transform: uppercase;">Marketplace</a>
                       
                        <div class="item"><div class="icon"> <img src="../static/media/eth_offline.svg" class="ui image" style="width: 35px; height: 35px;" data-tooltip="Add users to your feed" data-position="bottom left"></div></div>
                    </div>
                </div>
            </div>
            <!--end ui top container-->
                <div class="ui segment">
                    <div class="ui text container">
                        <h1 class="ui header" style="font-size: 3em; margin: 1em 0em 0em;">How does it work?</h1>
                        <h2 class="ui header" style="font-size: 1.7em;">Learn how to take over the China!</h2>
                        <p>This is all you need to know about BlockChina:  
                            <br>
                            <br>
                        </p>
                        <p>Every available province has one smart contract token. If you buy it, you own it, and your ownership will be visible on our interactive map as the HEX color of the six last characters in your wallet address. For a small fee you can customize your nickname and even put a clickable url to promote your website!</p>
                        <p>The provinces are visible on the Ethereum Blockchain as smart contracts. Therefore, they can only be acquired using Ether. Each province contract works similarly to a token or a coin and can only be owned by one individual.</p>
                        <p>You can take over any available province on the interactive map. Anyone else can also purchase and take over the province you own as long as they pay you the new price calculated from the province smart contract that previously acquired.</p>
                        <p>The price increase is hard coded into the smart contract and follow this model:</p>
                        <table class="ui celled table" style="margin: 2em 0em;">
                            <thead class="">
                                <tr class="">
                                    <th class="">Value Increase Levels</th>
                                    <th class="">Price Range</th>
                                    <th class="">Price Increase</th>
                                    <th class="">Dev Cut</th>
                                </tr>
                            </thead>
                            <tbody class="">
                                <tr class="">
                                    <td class="">Increase 1</td>
                                    <td class="">0.001 ETH - 0.02 ETH</td>
                                    <td class="">100%</td>
                                    <td class="">5%</td>
                                </tr>
                                <tr class="">
                                    <td class="">Increase 2</td>
                                    <td class="">0.02 ETH - 0.5 ETH</td>
                                    <td class="">35%</td>
                                    <td class="">4%</td>
                                </tr>
                                <tr class="">
                                    <td class="">Increase 3</td>
                                    <td class="">0.5 ETH - 2.0 ETH</td>
                                    <td class="">25%</td>
                                    <td class="">3%</td>
                                </tr>
                                <tr class="">
                                    <td class="">Increase 4</td>
                                    <td class="">2.0 ETH - 5.0 ETH</td>
                                    <td class="">17%</td>
                                    <td class="">3%</td>
                                </tr>
                                <tr class="">
                                    <td class="">Increase 5</td>
                                    <td class="">5.0 ETH - </td>
                                    <td class="">15%</td>
                                    <td class="">2%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <!-- the begin of the footer-->
                <?php
                    include("../static/footer.php");
                ?>
                <!--end of footer-->
                </div>
                <!--end end of the footer-->
            </div>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
    <script src="../static/js/semantic.min.js"></script>
    <script type="text/javascript" src="../static/js/app.js"></script>
</body>

</html>