//SPDX-License-Identifier: MIT

// store metadata per tokenid in ipfs []
// fix the ip to be used for the erc1155 contract [x]
// add events for main functions []

// mark a place after upgarde as solarpunk or cyberpunk []
// revenue stream to verifiers after upgrade []

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract YourContract is ERC1155 {

    struct User {
        string name;
        string hometown;
        string country;
    }
    User user;

    uint256 public placeId;
    uint256 private energy;
    uint256 private chip;
    // the use of constant is not coherent if there can be more than one upgrade possible
    uint256 constant public energyPerPlaceTreshold = 10;
    uint256 constant public chipPerPlaceTreshold = 10;
    uint256 constant public verificationPerPlaceTreshold = 2;
    address[] public registeredUsers;

    enum Type {
        type0,
        type1,
        type2,
        type3,
        type4
    }

    enum Quest {
        Solarpunk,
        Cyberpunk
    } 

    struct Place {
        Type placeType;
        // string city;
    }
    Place place;    

    mapping(address => User) public addressToUserDetail;
    mapping(address => bool) public userRegistered;
    mapping(uint => Place) public placeIdToPlaceDetail;
    mapping(uint => address) public placeIdToRegisterAddress;
    mapping(uint256 => uint256) public placeIdToVerificationTimes;
    // mappings to track energy and chips per user + place
    mapping(address => uint256) public energyPerAddress;
    mapping(address => uint256) public chipPerAddress;
    mapping(uint256 => uint256) public energyPerPlace;
    mapping(uint256 => uint256) public chipPerPlace;
    // mapping to track place level
    mapping(uint256 => uint256) public placeIdLevel;
    //mapping to track the validators per place
    mapping(address => mapping(uint256 => bool)) public verifiersPerPlaceId; 
    // mapping to track the player quest for place
    mapping(address => mapping(uint256 => Quest)) public playerQuestTypePerPlaceId; 
    //mapping to track the amount of energy & chips deposited in the place id
    mapping(address => mapping(uint256 => uint256)) public playerEnergyDepositedPerPlaceId; 
    mapping(address => mapping(uint256 => uint256)) public playerChipDepositedPerPlaceId;   
    // track the tokenID with uris
    mapping (uint256 => string) public uris;      


    modifier isUserRegistered(address _address) {
        require(userRegistered[_address], "This user is not registered");
        _;
    }

    // this modifier doesn't look like a solid solution. doesn't work with place id 0 
    modifier placeIdExists(uint256 _placeId) {
        require(_placeId <= placeId, "This place id doesn't exist");
        _;
    }

    constructor() ERC1155("") {
        placeId = 0;
    }    

    /**
     * @dev Registering user in the game
     */

    function registerUser(string memory _name, string memory _hometown, string memory _country) public {

        require(userRegistered[msg.sender] == false, "You are already registered");

        userRegistered[msg.sender] = true;

        // if this array is ocnfirmed then the previous mapping can be deleted
        registeredUsers.push(msg.sender);        

        addressToUserDetail[msg.sender].name = _name;
        addressToUserDetail[msg.sender].hometown = _hometown;
        addressToUserDetail[msg.sender].country = _country;
    }

    /**
     * @dev User is registering a place in the game
     */

    function registerPlace(uint256 _placeType, uint256 _questType, string memory _ipfsuri) public isUserRegistered(msg.sender) {

        // updating the place struct
        placeIdToPlaceDetail[placeId].placeType = Type(_placeType);
        // placeIdToPlaceDetail[placeId].city = _city;  

        // updating players' mappings
        placeIdToRegisterAddress[placeId] = msg.sender;
        verifiersPerPlaceId[msg.sender][placeId] = true;        
        playerQuestTypePerPlaceId[msg.sender][placeId] = Quest(_questType);

        // user gets one energy point for registering place
        energyPerAddress[msg.sender] += 1;

        //registration results in the place being minted as an nft. the nft id will be the same as the placeId
        mint(msg.sender, placeId, 1, "");
        setTokenUri(placeId, _ipfsuri);

        placeId += 1;
    }

    // function getPlaceCity(uint256 _placeId) public view returns(string memory) {
    //     return(placeIdToPlaceDetail[_placeId].city);
    // }

    /**
     * @dev User is verifying a place in the game. Place register is not allowed to verify its own place
     */

    function verifyPlace(uint256 _placeId, uint256 _questType) public isUserRegistered(msg.sender) {

        require(_placeId < placeId, "This placeId doesn't exist yet");
        require(verifiersPerPlaceId[msg.sender][_placeId] == false, "You can't verify twice");

        placeIdToVerificationTimes[_placeId] += 1;

        energyPerAddress[msg.sender] += 1;      

        // mappings updated. with this we know the address that verify a certain place id
        verifiersPerPlaceId[msg.sender][_placeId] = true;  
        playerQuestTypePerPlaceId[msg.sender][_placeId] = Quest(_questType);   
    }

    //WARNING! just for the sake of testing.
    function transferEnergyAndchips(address _to, uint256 _energy, uint256 _chips) public {

        energyPerAddress[_to] += _energy;
        chipPerAddress[_to] += _chips;
    }

    function depositEnergy(uint256 _placeId, uint256 _energy) public placeIdExists(_placeId) {

        require(energyPerAddress[msg.sender] >= _energy, "You don't have enough energy");

        // track how much was deposited
        playerEnergyDepositedPerPlaceId[msg.sender][_placeId] += _energy;
        
        energyPerPlace[_placeId] += _energy;
        energyPerAddress[msg.sender] -= _energy;                
    }

    function depositChip(uint256 _placeId, uint256 _chips) public placeIdExists(_placeId) {

        require(energyPerAddress[msg.sender] >= _chips, "You don't have enough chips");

        // track how much was deposited
        playerChipDepositedPerPlaceId[msg.sender][_placeId] += _chips;
        
        chipPerPlace[_placeId] += _chips;
        chipPerAddress[msg.sender] -= _chips;                
    }

     /**
     * @dev User can upgrade a place after some conditions are met. As a result, rewards are shared among verifiers
     */

    function assignReward(address _player, uint256 _placeId) public view returns(uint256, uint256) {

        uint256 energyReward = 0;
        uint256 chipReward = 0;

        energyReward = playerEnergyDepositedPerPlaceId[_player][_placeId] * 2; 
        chipReward = playerChipDepositedPerPlaceId[_player][_placeId] * 2;
        return(energyReward, chipReward);
    }

    function upgradePlace(uint256 _placeId) public placeIdExists(_placeId) {

        require(placeIdToVerificationTimes[_placeId] >= verificationPerPlaceTreshold, "This place can't be upgraded because there are not enough verifications");
        require(energyPerPlace[_placeId] >= energyPerPlaceTreshold, "This place can't be upgraded because there is not enough energy deposited");
        require(chipPerPlace[_placeId] >= chipPerPlaceTreshold, "This place can't be upgraded because there are not enough chips deposited");
        //to check functionality: require(verifiersPerPlaceId[msg.sender][_placeId] == true, "Only verifiers of this place can upgrade it");        

        // new nfts of the same token id are minted and shared amond verifiers.
        mint(msg.sender, _placeId, placeIdToVerificationTimes[_placeId], "");
        // calculate rewards
        address[] memory verifiers = getVerifiers(_placeId);
        for(uint i = 0; i < verifiers.length; i++) {
            // an nft should not be sent to the regster
            if(verifiers[i] == placeIdToRegisterAddress[_placeId]) {
                if(verifiers[i] == msg.sender) {
                    // person that upgrades receives 5x the units deposited
                    uint256 energyReward = playerEnergyDepositedPerPlaceId[verifiers[i]][_placeId] * 5;
                    uint256 chipReward = playerChipDepositedPerPlaceId[verifiers[i]][_placeId] * 5;
                    energyPerAddress[verifiers[i]] += (energyReward + 1);
                    chipPerAddress[verifiers[i]] += (chipReward + 1);                            
                } else {
                    // verifiers received double the amount of units deposited after upgrade
                    (uint256 energyReward1, uint256 chipReward1) = assignReward(verifiers[i], _placeId);
                    energyPerAddress[verifiers[i]] += (energyReward1 + 1);
                    chipPerAddress[verifiers[i]] += (chipReward1 + 1);                   
                }        
            } else {
                safeTransferFrom(msg.sender, verifiers[i], _placeId, 1, "");
                if(verifiers[i] == msg.sender) {
                    // person that upgrades receives 5x the units deposited
                    uint256 energyReward = playerEnergyDepositedPerPlaceId[verifiers[i]][_placeId] * 5;
                    uint256 chipReward = playerChipDepositedPerPlaceId[verifiers[i]][_placeId] * 5;
                    energyPerAddress[verifiers[i]] += (energyReward + 1);
                    chipPerAddress[verifiers[i]] += (chipReward + 1);                            
                } else {
                    // verifiers received double the amount of units deposited after upgrade
                    (uint256 energyReward1, uint256 chipReward1) = assignReward(verifiers[i], _placeId);
                    energyPerAddress[verifiers[i]] += (energyReward1 + 1);
                    chipPerAddress[verifiers[i]] += (chipReward1 + 1);                   
                }                  
            }     
        }
        //upgrade next level
        placeIdLevel[_placeId] += 1;        

    }

    function getVerifiers(uint256 _placeId) public view returns(address[] memory) {

        //adding 1 because register is also added among the verifiers
        address[] memory result = new address[](placeIdToVerificationTimes[_placeId]+1);
        uint counter = 0;

        for (uint256 i = 0; i < registeredUsers.length; i++) {
            if(verifiersPerPlaceId[registeredUsers[i]][_placeId] == true) {
                result[counter] = (registeredUsers[i]);
                counter++;
            }
        }
        return result;
    }  

    function getPlaceIdPerAddress() public view returns(uint256[] memory) {

        uint256[] memory result = new uint256[](placeId);
        uint counter = 0;

        for (uint256 i = 0; i < placeId; i++) {
            if(placeIdToRegisterAddress[i] == msg.sender) {
                result[counter] = (i);
                counter++;
            }
        }
        return result;
    } 

// Minting and metadata part

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        private
    {
        _mint(account, id, amount, data);
    }

    function uri(uint256 _tokenId) override public view returns (string memory) {
        return(uris[_tokenId]);
    } 

    function setTokenUri(uint256 _tokenId, string memory _uri) internal {
        require(bytes(uris[_tokenId]).length == 0, "Cannot set uri twice"); 
        uris[_tokenId] = _uri; 
    }         
}