//Step 1.
import { Client, PrivateKey } from 'dsteem';
import { accounts } from '../../configuration';
let opts = {};

//connect to community testnet
opts.addressPrefix = 'STX';
opts.chainId =
    '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673';
//connect to server which is connected to the network/testnet
const client = new Client('https://testnet.steem.vc', opts);

//Step 2. user fills in the values for 'parent_author' and 'parent_permlink'
//Step 3. user adds content for the comment in the 'body' textarea

//submit post function
window.submitComment = async () => {
    //Step 4. get all values from the UI

    //get private key
    const privateKey = PrivateKey.fromString(
        document.getElementById('postingKey').value
    );
    //get account name
    const account = document.getElementById('username').value;
    //get body
    const body = document.getElementById('body').value;
    //get parent author permalink
    const parent_author = document.getElementById('parent_author').value;
    //get parent author permalink
    const parent_permlink = document.getElementById('parent_permlink').value;

    //generate random permanent link for post
    const permlink = Math.random()
        .toString(36)
        .substring(2);

    const payload = {
        author: account,
        title: '',
        body: body,
        parent_author: parent_author,
        parent_permlink: parent_permlink,
        permlink: permlink,
        json_metadata: '',
    };

    console.log('client.broadcast.comment payload:', payload);
    client.broadcast.comment(payload, privateKey).then(
        function(result) {
            console.log('client.broadcast.comment response', result);
            document.getElementById('postLink').style.display = 'block';
            document.getElementById(
                'postLink'
            ).innerHTML = `<br/><p>Included in block: ${
                result.block_num
            }</p><br/><br/><a href="http://condenser.steem.vc/@${parent_author}/${parent_permlink}">Check post here</a>`;
        },
        function(error) {
            console.error(error);
        }
    );
};

window.clearFields = function() {
    document.getElementById('body').value = '';
    document.getElementById('parent_author').value = '';
    document.getElementById('parent_permlink').value = '';
};

window.onload = () => {
    const account = accounts.testnet[0];
    document.getElementById('username').value = account.username;
    document.getElementById('postingKey').value = account.privPosting;
};
