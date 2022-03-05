//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// user registration by using input: social tag, hometown, country [x]
// keep track of the registered users [x]
// keep track of the user details. function to retrieve input(?), mapping(?) [x]
// if players are registered, they can play: modifier [x]
// register place(type, name, map coord, city) [x]
// need a way to keep track of existing places [x]
// verify existing places. based on what? done via FE. keep track of the number of verifications via mapping  [x]
// keep track of two variables for both places and users: energy & bolts [x]
// upgrade function requires check on validation, energy and bolts [x]
// transfer functions for energy and bolts. [x]

contract Punk_Cities {

    struct User {
        string name;
        string hometown;
        string country;
    }
    User user;

    uint256 public placeId;
    uint256 private energy;
    uint256 private bolt;
    // the use of constant is not coherent if there can be more than one upgrade possible
    uint256 constant public energyPerPlaceTreshold = 20;
    uint256 constant public boltPerPlaceTreshold = 20;
    uint256 public placeLevel = 1;

    enum Type {
        type0,
        type1,
        type2
    }  

    struct Place {

        Type placeType;
        string name;
        string mapAddress;
        string city;
    }
    Place place;    

    mapping(address => User) public addressToUserDetail;
    mapping(address => bool) public userRegistered;
    mapping(uint => Place) public placeIdToPlaceDetail;
    mapping(uint => address) public placeIdToRegisterAddress;
    mapping(uint256 => uint256) public placeIdToVerificationTimes;
    // mappings to track energy and bolts per user + place
    mapping(address => uint256) public energyPerAddress;
    mapping(address => uint256) public boltPerAddress;
    mapping(uint256 => uint256) public energyPerPlace;
    mapping(uint256 => uint256) public boltPerPlace;
    // mapping to track place level
    mapping(uint256 => uint256) public placeIdLevel;    

    modifier isUserRegistered(address _address) {
        require(userRegistered[_address], "This user is not registered");
        _;
    }

    // this modifier doesn't look like a solid solution. doesn't work with place id 0 
    modifier placeIdExists(uint256 _placeId) {
        require(_placeId <= placeId, "This place id doesn't exist");
        _;
    }

    constructor() {
        placeId = 0;
    }    

    // Register user

    function registerUser(string memory _name, string memory _hometown, string memory _country) public {

        userRegistered[msg.sender] = true;

        addressToUserDetail[msg.sender].name = _name;
        addressToUserDetail[msg.sender].hometown = _hometown;
        addressToUserDetail[msg.sender].country = _country;
    }

    function getUserName(address _address) public view returns(string memory) {
        return(addressToUserDetail[_address].name);
    }

    function getUserHometown(address _address) public view returns(string memory) {
        return(addressToUserDetail[_address].hometown);
    }

    function getUserCountry(address _address) public view returns(string memory) {
        return(addressToUserDetail[_address].country);
    }

    //Verification places.

    function registerPlace(uint256 _placeType, string memory _name, string memory _mapAddress, string memory _city) public isUserRegistered(msg.sender) {

        placeIdToPlaceDetail[placeId].placeType = Type(_placeType);
        placeIdToPlaceDetail[placeId].name = _name;
        placeIdToPlaceDetail[placeId].mapAddress = _mapAddress;
        placeIdToPlaceDetail[placeId].city = _city;  

        placeIdToRegisterAddress[placeId] = msg.sender;

        placeId += 1;
    }

    function getPlaceType(uint256 _placeId) public view returns(Type) {
        return(placeIdToPlaceDetail[_placeId].placeType);
    }

    function getPlaceName(uint256 _placeId) public view returns(string memory) {
        return(placeIdToPlaceDetail[_placeId].name);
    }

    function getPlaceMapAddress(uint256 _placeId) public view returns(string memory) {
        return(placeIdToPlaceDetail[_placeId].mapAddress);
    }

    function getPlaceCity(uint256 _placeId) public view returns(string memory) {
        return(placeIdToPlaceDetail[_placeId].city);
    }

    //Verify place

    function verifyPlace(uint256 _placeId) public isUserRegistered(msg.sender) {

        placeIdToVerificationTimes[_placeId] += 1;     
    }

    //Upgrade place

    //WARNING! just for the sake of testing. a better behavior should be found to specify how energy and bolts are transferred among users
    function transferEnergyAndBolts(address _to, uint256 _energy, uint256 _bolts) public {

        energyPerAddress[_to] += _energy;
        boltPerAddress[_to] += _bolts;
    }

    function depositEnergy(uint256 _placeId, uint256 _energy) public placeIdExists(_placeId) {

        require(energyPerAddress[msg.sender] >= _energy, "You don't have enough energy");
        
        energyPerPlace[_placeId] += _energy;
        energyPerAddress[msg.sender] -= _energy;                
    }

    function depositBolts(uint256 _placeId, uint256 _bolts) public placeIdExists(_placeId) {

        require(energyPerAddress[msg.sender] >= _bolts, "You don't have enough bolts");
        
        boltPerPlace[_placeId] += _bolts;
        boltPerAddress[msg.sender] -= _bolts;                
    }

    function upgradePlace(uint256 _placeId) public placeIdExists(_placeId) {

        require(placeIdToVerificationTimes[_placeId] >= 25, "This place can't be upgraded because there are not enough verifications");
        require(energyPerPlace[_placeId] >= energyPerPlaceTreshold, "This place can't be upgraded because there is not enough energy depositted");
        require(boltPerPlace[_placeId] >= boltPerPlaceTreshold, "This place can't be upgraded because there are not enough bolts depositted");  

        placeIdLevel[_placeId] += 1;    

    }        
}