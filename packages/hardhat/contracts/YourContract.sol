//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// user registration by using input: social tag, hometown, country [x]
// keep track of the registered users [x]
// keep track of the user details. function to retrieve input(?), mapping(?) [x]
// if players are registered, they can play: modifier [x]
// register place(type, name, map coord, city) [x]
// need a way to keep track of existing places [x]
// verify existing places. based on what? done via FE. keep track of the number of verifications via mapping  [x]
// keep track of two variables for both places and users: energy & bolts
// upgrade function requires check on validation, energy and bolts
// transfer functions for energy and bolts. need to mint

contract Punk_Cities {

    struct User {
        string name;
        string hometown;
        string country;
    }
    User user;

    uint256 public placeId;
    uint256 private energy;
    uint256 private bots;

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

    modifier isUserRegistered(address _address) {
        require(userRegistered[_address], "This user is not registered");
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



    

}