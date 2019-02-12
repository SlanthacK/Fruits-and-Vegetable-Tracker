/**
 * telling that F or V are harvested
 * @param {org.xyz.foodvegtracker.farmed} farm
 * @transaction
 */

 async function farming_done(farm)
 {
    if(farm.fandv.state=='NOT_HARVESTED' && farm.fandv.owner=='FARMER')
    {
        farm.fandv.state = 'HARVESTED';
    }
    else
    {
        throw new window.alert("it is already harvested");   
    }
    return getAssetRegistry('org.xyz.foodvegtracker.FandV')
    .then(function updateRegistry(assetRegistry)
          {return assetRegistry.update(farm.fandv)});
 }