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
        throw new window.alert("it already has been requested");
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

/**
 * farmer will approve request from primarey distributor
 * @param {org.xyz.foodvegtracker.apprv_req_pDistributor_to_farmer} apprv
 * @transaction
 */

 async function apprv_req_farmer(apprv)
 {
     if(apprv.fandv.req_state=='Requested_by_pDistributor' && apprv.fandv.owner=='FARMER')
     {
         apprv.fandv.req_state='approved_by_farmer';
     }
     else if (apprv.fandv.req_state=='approved_by_farmer')
     {
         throw new window.alert("it already has been approved")
     }
     return getAssetRegistry('org.xyz.foodvegtracker.FandV')
     .then(function updateRegistry(assetRegistry)
           {return assetRegistry.update(apprv.fandv)});
 }
 
 /**
  * farmer will send fandv to primary distributor
  * @param {org.xyz.foodvegtracker.send_farmer_to_pDistributor} send
  * @transaction 
  */

  async function send_to_primarydistributor(send)
  {
      if(send.fandv.req_state=='approved_by_farmer' && send.fandv.owner=='FARMER')
      {
          send.fandv.owner='PRIMARYDISTRIBUTOR';
          send.fandv.req_state='NA';
      }
      else if (send.fandv.req_state!='approved_by_farmer')
      {
          throw new window.alert("it not approved by the farmer");
      }
      else if (send.fandv.owner!='FARMER')
      {
        throw new window.alert("owner is not a farmer");
      }
      return getAssetRegistry('org.xyz.foodvegtracker.FandV')
      .then(function updateRegistry(assetRegistry)
            {return assetRegistry.update(send.fandv)});
  }