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
        farm.fandv.expDate = farm.exp;
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
    else
    {
        throw new window.alert("unknown error");
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
     else
     {
         throw new window.alert("unknown error");
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
      else
      {
          throw new window.alert("unknown error");
      }
      return getAssetRegistry('org.xyz.foodvegtracker.FandV')
      .then(function updateRegistry(assetRegistry)
            {return assetRegistry.update(send.fandv)});
  }

  /**
   * send fandv for quality inspection
   * @param {org.xyz.foodvegtracker.send_pDistributor_to_qualityInspection} inspect
   * @transaction
   */

   async function send_to_quality_inspection(inspect)
   {
       if(inspect.fandv.owner=='PRIMARYDISTRIBUTOR')
       {
        inspect.fandv.owner='QUALITYINSPECTOR';
        inspect.fandv.state='GETTING_INSPECTED';
       }
       else
       {
        throw new window.alert("owner is not primary distributor");
       }
       return getAssetRegistry('org.xyz.foodvegtracker.FandV')
       .then(function updateRegistry(assetRegistry)
             {return assetRegistry.update(inspect.fandv)});
   }

/**
 * to tell that it is inspected
 * @param {org.xyz.foodvegtracker.Inspected} insp
 * @transaction
 */

 async function inspector(insp)
 {
     if(insp.fandv.owner=='QUALITYINSPECTOR')
     {
         if(insp.no_to_reject<=insp.fandv.quantity)
         {
            insp.fandv.quantity=insp.fandv.quantity-insp.no_to_reject;
            insp.fandv.state='INSPECTED';
            insp.fandv.quality=insp.qual;
            insp.fandv.freshness=insp.fresh
            let temp = getFactory().newResource('org.xyz.foodvegtracker','FandV',insp.fandv.batchid+'-reg');
            temp.name=insp.fandv.name;
            temp.owner=insp.fandv.owner;
            temp.state='INSPECTED';
            temp.req_state=insp.fandv.req_state;
            temp.quality='Rejected';
            temp.freshness='STALE';
            temp.quantity=insp.no_to_reject;
            let fandvregistry = await getAssetRegistry('org.xyz.foodvegtracker.FandV');
            await fandvregistry.addAll([temp]);
         }
         else
         {
            throw new window.alert("no rejection is more than quantity"); 
         }
     }
     else
     {
        throw new window.alert("owner is not quality inspector");
     }
     return getAssetRegistry('org.xyz.foodvegtracker.FandV')
     .then(function updateRegistry(assetRegistry)
           {return assetRegistry.update(insp.fandv)});
 }

 /**
  * send inspected fandv to primary distributor
  * @param {org.xyz.foodvegtracker.send_qualityInspection_to_pDistributor} send
  * @transaction
  */

  async function send_QI_to_PD(send)
  {
      if(send.fandv.owner=='QUALITYINSPECTOR' && send.fandv.state=='INSPECTED')
      {
          send.fandv.owner='PRIMARYDISTRIBUTOR';
      }
      else if (send.fandv.state=='AVAILABLE_FOR_SALE')
      {
        throw new window.alert("already inspected");
      }
      else if (send.fandv.state!='INSPECTED')
      {
        throw new window.alert("not inspected");
      }
      else if(send.fandv.owner!='QUALITYINSPECTOR')
      {
        throw new window.alert("owner in not quality inspector");
      }
      else
      {
          throw new window.alert("unknown error");
      }
      return getAssetRegistry('org.xyz.foodvegtracker.FandV')
      .then(function updateRegistry(assetRegistry)
            {return assetRegistry.update(send.fandv)});
  }

  /**
   * send rejected fandv to farmer to use it as manure
   * @param  {org.xyz.foodvegtracker.send_rejected_pDistributor_to_farmer} send
   * @transaction
   */

   async function send_rej_to_farmer(send)
   {
    if(send.fandv.quality=='Rejected' && send.fandv.owner=='PRIMARYDISTRIBUTOR' && send.fandv.req_state=='approved_by_pDistributor_rejected')
       {
        send.fandv.owner='FARMER';
       }
       else if(send.fandv.quality!='Rejected')
       {
        throw new window.alert("fandv is not rejected");
       }
       else
       {
           throw new window.alert("unknown error");
       }
       return getAssetRegistry('org.xyz.foodvegtracker.FandV')
       .then(function updateRegistry(assetRegistry)
             {return assetRegistry.update(send.fandv)});
   }

  /**
   * request for rejected fandv to use it as manure
   * @param  {org.xyz.foodvegtracker.req_farmer_to_pDistributor} req
   * @transaction
   */

  async function req_farmer_to_pdistributor(req)
  {
   if(req.fandv.quality=='Rejected' && req.fandv.owner=='PRIMARYDISTRIBUTOR')
      {
       req.fandv.req_state='requested_by_farmer';
      }
      else if(req.fandv.quality!='Rejected')
      {
       throw new window.alert("fandv is not rejected");
      }
      else
      {
          throw new window.alert("unknown error");
      }
      return getAssetRegistry('org.xyz.foodvegtracker.FandV')
      .then(function updateRegistry(assetRegistry)
            {return assetRegistry.update(req.fandv)});
  }

    /**
   * apprv for rejected fandv to use it as manure
   * @param  {org.xyz.foodvegtracker.apprv_req_farmer_to_pDistributor} apprv
   * @transaction
   */

  async function apprv_req_farmer_to_pdistributor(apprv)
  {
   if(apprv.fandv.quality=='Rejected' && apprv.fandv.owner=='PRIMARYDISTRIBUTOR')
      {
       apprv.fandv.req_state='approved_by_pDistributor_for_rejected';
      }
      else if(apprv.fandv.quality!='Rejected')
      {
       throw new window.alert("fandv is not rejected");
      }
      else
      {
          throw new window.alert("unknown error");
      }
      return getAssetRegistry('org.xyz.foodvegtracker.FandV')
      .then(function updateRegistry(assetRegistry)
            {return assetRegistry.update(apprv.fandv)});
  }