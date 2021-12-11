var hex
    document
      .getElementById('inputfile')
      .addEventListener('change', function () {
        var fr = new FileReader()
        fr.onload = function () {
          document.getElementById('output').textContent = fr.result
          hex = '0x' + sha256(fr.result)
        }

        fr.readAsText(this.files[0])
      })
    function timeConverter(UNIX_timestamp) {
      var a = new Date((UNIX_timestamp - 3600 * 3) * 1000)
      var months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]
      var year = a.getFullYear()
      var month = months[a.getMonth()]
      var date = a.getDate()
      var hour = a.getHours()
      var min = a.getMinutes()
      var sec = a.getSeconds()
      var time =
        date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec
      return time
    }
    const ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "add",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_adminAdress",
				"type": "address"
			}
		],
		"name": "addAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "verify",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
    const contractAddress = '0x9F441125C416E8451bd476e003E7e136e0Fe174C'
    async function loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        window.ethereum.enable()
      }
    }
    async function loadContract() {
      return await new window.web3.eth.Contract(ABI, contractAddress)
    }

    async function load() {
      await loadWeb3()
      window.contract = await loadContract()
      updateStatus('Ready!')
    }
    function verify() {
      return window.contract.methods
        .verify(hex)
        .call()
        .then(function (x) {
          console.log(timeConverter(x))
          return x
        })
    }
    async function add() {
      var verifyStatus = await verify()
      if (verifyStatus == 0) {
        window.contract.methods
          .add(hex)
          .send({ from: ethereum.selectedAddress })
          .then(function (receipt) {
            console.log(receipt)
          })
      } else {
        console.log('doc already verified.')
      }
    }
    function updateStatus(status) {
      const statusEl = document.getElementById('status')
      statusEl.innerHTML = status
      console.log(status)
    }

    load()