/* eslint-disable import/no-dynamic-require, no-await-in-loop, no-restricted-syntax, guard-for-in, import/no-unresolved */
require('dotenv').config();
const hre = require('hardhat');
const { expect } = require('chai');
const deployOutput = require('./deploy_output.json');

async function main() {
    // load deployer account
    if (typeof process.env.ETHERSCAN_API_KEY === 'undefined') {
        throw new Error('Etherscan API KEY has not been defined');
    }

    try {
        await hre.run('verify:verify', { address: deployOutput.dappnodeSmoothingPool });
    } catch (error) {
        expect(error.message.toLowerCase().includes('already verified')).to.be.equal(true);
    }

    const minDelayTimelock = 604800;
    const timelockAdminAddress = '0x67C1A3e1Ce35c31Cd4fC27F987821b48cA928d57';

    try {
        await hre.run('verify:verify', {
            address: deployOutput.timelockContract,
            constructorArguments: [
                minDelayTimelock,
                [timelockAdminAddress],
                [timelockAdminAddress],
                timelockAdminAddress,
            ],
        });
    } catch (error) {
        expect(error.message.toLowerCase().includes('already verified')).to.be.equal(true);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
