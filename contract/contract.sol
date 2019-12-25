pragma solidity ^0.4.24;
contract MainContract
{
	uint public proId;//assign project id to the listed projects
	uint public invId;//assign investor id to listed investors
	address public owner;// store owner address
	constructor()public
	{
    owner = msg.sender;
	}
	struct Project//struct for projects
	{
    	string proName;
    	uint proAmt;
    	string proOwner;
    	uint raisedAmt;
    	uint proStart;
    	uint proEnd;
    	mapping(uint=>uint) invShare;	//??
    	mapping(uint=>uint) invConv;	//??
	}
	struct Investor//struct for investors
	{
    	string invAddress;
    	uint invPhone;
    	string invEmail;
    	mapping(uint=>uint) invTime;
    	mapping(uint=>uint) proShare;	//??
    	mapping(uint=>uint) proConv;	//??
	}

	// Project[] public pro;//dynamic array to store projects details
	// Investor[] public inv;//dynamic array to store investor details

	mapping(uint=>Project) public mappedPro;
	mapping(uint=>Investor) public mappedInv;
	mapping(uint=>mapping(uint=>uint)) public investRecord;
	function proDetails(string _proName,uint _proAmt, string _userID)public returns(uint)
	{//function to store accept project details
      require(msg.sender==owner, "non owner invoking this function");
    	Project memory newPro = Project
    	({
        	proName:_proName,
        	proAmt:_proAmt,
        	proOwner:_userID,
        	raisedAmt:0,
        	proStart:now,
        	proEnd:now+94348800
    	});
    	// pro.push(newPro);
    	proId = proId+1;
    	mappedPro[proId] = newPro;//link project details with project id
			return proId;
	}
	function invDetail(uint _invPhone,string _invEmail, string _userID)public returns(uint)
	{//function to store investor details
      require(msg.sender==owner, "non owner invoking this function");
    	Investor memory newInv = Investor
    	({
        	invAddress:_userID,
        	invPhone:_invPhone,
        	invEmail:_invEmail
    	});
    	// inv.push(newInv);
    	invId = invId+1;
    	mappedInv[invId] = newInv;//link investor details with investor id
    	return invId;
	}
	function invest(uint _invID,uint _proID, string _userID, uint _investAmt) public payable//for investment
	{
      require(msg.sender==owner, "non owner invoking this function");
			//to check authenticity of investor
    	require(keccak256(bytes(_userID))==keccak256(bytes(mappedInv[_invID].invAddress)), "not authentic investor");
			//to check project is live or not
    	require(now > mappedPro[_proID].proStart && now < mappedPro[_proID].proEnd, "project is not live");
    	// require((msg.sender).balance>=msg.value, "sender balance is low");//to check amount send is feasible
			//to check the investor has not invested in the project before
    	require(investRecord[_invID][_proID]==0, "investor invested in the project before");
    	require(mappedPro[_proID].raisedAmt<=mappedPro[_proID].proAmt, "raised ammount check");

    	investRecord[_invID][_proID] = _investAmt;
    	mappedPro[_proID].raisedAmt = mappedPro[_proID].raisedAmt+_investAmt;
    	// mappedPro[_proID].proOwner.transfer(msg.value);//tranfer amount to project owner
    	mappedInv[_invID].invTime[_proID] = now;
    	mappedInv[_invID].proShare[_proID] = calaculate1(investRecord[_invID][_proID],_proID);
    	mappedInv[_invID].proConv[_proID] = calaculate2(investRecord[_invID][_proID]);
    	mappedPro[_proID].invShare[_invID] = mappedInv[_invID].proShare[_proID];
    	mappedPro[_proID].invConv[_invID] = mappedInv[_invID].proConv[_proID];
	}
	function withdraw(uint _invID,uint _proID, string _userID) public payable//for withdrawing amount
	{
			//checking authenticity of investor
    	require(keccak256(bytes(_userID)) == keccak256(bytes(mappedInv[_invID].invAddress)), "not authentic investor");
			//to check whether the time period is within one week of investment
    	require((now>mappedPro[_proID].proStart && now<mappedPro[_proID].proEnd)&&(now<mappedInv[_invID].invTime[_proID]+1 weeks), "time period is not within one week of investment");
    	require(investRecord[_invID][_proID]!=0, "investment record");

    	mappedPro[_proID].raisedAmt = mappedPro[_proID].raisedAmt-investRecord[_invID][_proID];
    	// mappedInv[_invID].invAddress.transfer((uint)((investRecord[_invID][_proID]*19)/20));
    	owner.transfer(investRecord[_invID][_proID]-(uint)((investRecord[_invID][_proID]*19)/20));
    	investRecord[_invID][_proID] = 0;
    	mappedInv[_invID].proShare[_proID] = 0;
    	mappedInv[_invID].proConv[_proID] = 0;
    	mappedPro[_proID].invShare[_invID] = 0;
    	mappedPro[_proID].invConv[_invID] = 0;
	}
	function getShareAndConv(uint _invID, uint _proID) public view returns(uint share, uint conv){
		return (mappedInv[_invID].proShare[_proID], mappedInv[_invID].proConv[_proID]);
	}
	function calaculate1(uint price,uint _proId) public view returns(uint)//calculate project shares
	{
  	return((uint)((price*100)/mappedPro[_proId].proAmt));
	}
	function calaculate2(uint price)public pure returns(uint)//calculate convertible
	{
    return((uint)(price*24)/100);
	}
}