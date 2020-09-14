// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.5.5;

import "../access/owner/OwnerStorage.sol";
import "../access/AccessStorage.sol";
import "../ERC721Token/ERC721Logistic/ERC721LogisticStorage.sol";
import "../name/NameStorage.sol";
import "../pause/PauseStorage.sol";
import "../product/ProductStorage.sol";


/**
 * @title LogisticSharedStorage
 * @dev This contract defines the storage layout of the proxy contract and all the logic contracts.
 */
contract LogisticSharedStorage is
    OwnerStorage,
    AccessStorage,
    ERC721LogisticStorage,
    NameStorage,
    PauseStorage,
    ProductStorage {
    bool internal lock = true;
}
