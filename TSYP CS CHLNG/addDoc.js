var hex;
    
    document
        .getElementById('real-file')
        .addEventListener('change', function () {
          hex = null
          var fr = new FileReader()

         
          let file = document.getElementById('real-file').files[0]
          let fileSize = file.size / 1024
          fr.readAsBinaryString(file);
          fr.onload = function (event) {        
            hex = '0x' + sha256(event.target.result)   
          }

          fr.onprogress = function(data) {
            if (data.lengthComputable) {                                            
                var progress = parseInt( ((data.loaded / data.total) * 100), 10 );
                ShowProg(progress)
            }
        }
          
        
        })
    function timeConverter(UNIX_timestamp) {
      var a = new Date((UNIX_timestamp - 3600 * 15) * 1000)
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
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_adminAdress",
				"type": "address"
			}
		],
		"name": "verifyAdmin",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
    const contractAddress = '0x415A63789918B8A4b8a4255b962938994124771C'
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
    }
    function verify() {
      if(hex!=null){
        return window.contract.methods
        .verify(hex)
        .call()
        .then(function (x) {
          if(x!=0){
            ShowStatus("This document was verified on "+timeConverter(x))
          }
          else{
            ShowStatus("verifying ..")
            return x
          }
        })
      }
      else{
        ShowStatus("please wait/upload a document")
      }
    }
    async function add() {
      var verifyPrivilege = await verifyAdmin()
      var verifyStatus = await verify()
      if(verifyStatus == 0){
        if(!verifyPrivilege){
        ShowStatus("you don't have administrative permissions.")
      }
      
      else{
        window.contract.methods
          .add(hex)
          .send({ from: ethereum.selectedAddress })
          .then(function () {
            ShowStatus("Document successfully verified")
          },
           function (){
            ShowStatus("There was an error")
          })
      }
      }
      
     
      
    }
    function verifyAdmin() {
      
      return window.contract.methods
      .verifyAdmin(ethereum.selectedAddress)
      .call()
      .then(function (b) {
        return b
      })
    
    

  }

    load()