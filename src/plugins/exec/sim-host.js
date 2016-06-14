// Copyright (c) Microsoft Corporation. All rights reserved.

/*global CordovaLabeledValue: false, CordovaItem: false */
// These globals are cordova-simulate custom elements.

var savedSims = require('./saved-sims');
var event = require('event');

module.exports = {
    initialize: function () {
        var sims = savedSims.sims;

        var execList = document.getElementById('exec-list');
        execList.addEventListener('itemremoved', function (e) {
            savedSims.removeSim(e.detail.itemIndex);

            if (!savedSims.sims.length) {
                showEmptyLabel();
            }
        });

        event.on('saved-sim-added', function (sim) {
            hideEmptyLabel();
            execList.addItem(cordovaItemFromSim(sim));
        });

        if (sims && sims.length) {
            sims.forEach(function (sim) {
                execList.addItem(cordovaItemFromSim(sim));
            });
        } else {
            // Create a "No values saved" item
            showEmptyLabel();
        }
    }
};

function cordovaItemFromSim(sim) {
    var labeledValue = new CordovaLabeledValue();
    labeledValue.label = sim.service + '.' + sim.action;

    var value = sim.value;
    if (typeof value === 'object') {
        try {
            value = JSON.stringify(value);
        } catch (e) {
            // ignore
        }
    }

    labeledValue.value = value;
    var cordovaItem = new CordovaItem();
    cordovaItem.appendChild(labeledValue);
    return cordovaItem;
}

function showEmptyLabel() {
    document.getElementById('empty-label').classList.remove('cordova-hidden');
    document.getElementById('exec-list').classList.add('cordova-hidden');
}

function hideEmptyLabel() {
    document.getElementById('empty-label').classList.add('cordova-hidden');
    document.getElementById('exec-list').classList.remove('cordova-hidden');
}

