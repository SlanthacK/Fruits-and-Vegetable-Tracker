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

 /**
  * primary distributor will request for fandv to farmer
  * @param {org.xyz.foodvegtracker.req_pDistributor_to_farmer} req
  * @transaction
  */

async function req_p_to_f(req)
{
    if(req.fandv.state=='HARVESTED' && req.fandv.req_state =='NA' && req.fandv.owner=='FARMER')
    {
        req.fandv.req_state="Requested_by_pDistributor";
    }
    else if (req.fandv.req_state=='Requested_by_pDistributor')
    {
        throw new window.alert("it has been already requested");
    }
    else if (req.fandv.req_state=='approved_by_farmer')
    {
        throw new window.alert("it has been already requested");
    }    
    else if (req.fandv.state=='NOT_HARVESTED')
    {
        throw new window.alert("it is not harvested");
    }
    else if (req.fandv.owner!='FARMER')
    {
        throw new window.alert("owner is not farmer");
    }
    return getAssetRegistry('org.xyz.foodvegtracker.FandV')
    .then(function updateRegistry(assetRegistry)
          {return assetRegistry.update(req.fandv)});
}