// Deal Service - ApperClient Integration
// Handles all deal-related data operations using deal_c table

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize ApperClient
function getApperClient() {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
}

// Get all deals
export async function getAll() {
  try {
    await delay(300);
    
    const apperClient = getApperClient();
    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "value_c"}},
        {"field": {"Name": "stage_c"}},
        {"field": {"Name": "expected_close_date_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "probability_c"}},
        {"field": {"Name": "contact_id_c"}},
        {"field": {"Name": "created_at_c"}},
        {"field": {"Name": "updated_at_c"}},
        {"field": {"Name": "Tags"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ],
      orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
      pagingInfo: {"limit": 100, "offset": 0}
    };
    
    const response = await apperClient.fetchRecords('deal_c', params);
    
    if (!response.success) {
      console.error("Error fetching deals:", response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching deals:", error?.response?.data?.message || error);
    return [];
  }
}

// Get deal by ID
export async function getById(id) {
  try {
    await delay(200);
    
    if (!id || !Number.isInteger(parseInt(id))) {
      console.error("Invalid deal ID provided:", id);
      return null;
    }
    
    const apperClient = getApperClient();
    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "value_c"}},
        {"field": {"Name": "stage_c"}},
        {"field": {"Name": "expected_close_date_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "probability_c"}},
        {"field": {"Name": "contact_id_c"}},
        {"field": {"Name": "created_at_c"}},
        {"field": {"Name": "updated_at_c"}},
        {"field": {"Name": "Tags"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ]
    };
    
    const response = await apperClient.getRecordById('deal_c', parseInt(id), params);
    
    if (!response.success) {
      console.error("Error fetching deal:", response.message);
      return null;
    }
    
    return response.data || null;
  } catch (error) {
    console.error("Error fetching deal:", error?.response?.data?.message || error);
    return null;
  }
}

// Create new deal
export async function create(dealData) {
  try {
    await delay(400);
    
    if (!dealData) {
      console.error("Deal data is required");
      return null;
    }
    
    // Prepare data with only Updateable fields
    const createData = {
      Name: dealData.Name || dealData.name_c || 'New Deal',
      name_c: dealData.name_c || dealData.Name || '',
      value_c: dealData.value_c ? parseFloat(dealData.value_c) : 0,
      stage_c: dealData.stage_c || 'Lead',
      expected_close_date_c: dealData.expected_close_date_c || '',
      description_c: dealData.description_c || '',
      probability_c: dealData.probability_c ? parseInt(dealData.probability_c) : 0,
      created_at_c: new Date().toISOString(),
      updated_at_c: new Date().toISOString()
    };
    
    // Handle lookup field - contact_id_c
    if (dealData.contact_id_c !== undefined && dealData.contact_id_c !== null) {
      createData.contact_id_c = parseInt(dealData.contact_id_c);
    }
    
    // Handle Tags if provided
    if (dealData.Tags) {
      createData.Tags = Array.isArray(dealData.Tags) ? dealData.Tags.join(',') : dealData.Tags;
    }
    
    const apperClient = getApperClient();
    const params = {
      records: [createData]
    };
    
    const response = await apperClient.createRecord('deal_c', params);
    
    if (!response.success) {
      console.error("Error creating deal:", response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} deals:`, failed);
        return null;
      }
      
      if (successful.length > 0) {
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error creating deal:", error?.response?.data?.message || error);
    return null;
  }
}

// Update deal
export async function update(id, dealData) {
  try {
    await delay(350);
    
    if (!id || !Number.isInteger(parseInt(id))) {
      console.error("Invalid deal ID provided:", id);
      return null;
    }
    
    if (!dealData) {
      console.error("Deal data is required for update");
      return null;
    }
    
    // Prepare update data with only Updateable fields
    const updateData = {
      Id: parseInt(id),
      updated_at_c: new Date().toISOString()
    };
    
    // Only include fields that are provided and Updateable
    if (dealData.Name !== undefined) updateData.Name = dealData.Name;
    if (dealData.name_c !== undefined) updateData.name_c = dealData.name_c;
    if (dealData.value_c !== undefined) updateData.value_c = parseFloat(dealData.value_c);
    if (dealData.stage_c !== undefined) updateData.stage_c = dealData.stage_c;
    if (dealData.expected_close_date_c !== undefined) updateData.expected_close_date_c = dealData.expected_close_date_c;
    if (dealData.description_c !== undefined) updateData.description_c = dealData.description_c;
    if (dealData.probability_c !== undefined) updateData.probability_c = parseInt(dealData.probability_c);
    if (dealData.created_at_c !== undefined) updateData.created_at_c = dealData.created_at_c;
    
    // Handle lookup field - contact_id_c
    if (dealData.contact_id_c !== undefined) {
      updateData.contact_id_c = dealData.contact_id_c ? parseInt(dealData.contact_id_c) : null;
    }
    
    // Handle Tags if provided
    if (dealData.Tags !== undefined) {
      updateData.Tags = Array.isArray(dealData.Tags) ? dealData.Tags.join(',') : dealData.Tags;
    }
    
    const apperClient = getApperClient();
    const params = {
      records: [updateData]
    };
    
    const response = await apperClient.updateRecord('deal_c', params);
    
    if (!response.success) {
      console.error("Error updating deal:", response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} deals:`, failed);
        return null;
      }
      
      if (successful.length > 0) {
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error updating deal:", error?.response?.data?.message || error);
    return null;
  }
}

// Delete deals
export async function deleteDeal(ids) {
  try {
    await delay(300);
    
    const idsArray = Array.isArray(ids) ? ids : [ids];
    const validIds = idsArray.filter(id => Number.isInteger(parseInt(id))).map(id => parseInt(id));
    
    if (validIds.length === 0) {
      console.error("No valid deal IDs provided for deletion");
      return false;
    }
    
    const apperClient = getApperClient();
    const params = {
      RecordIds: validIds
    };
    
    const response = await apperClient.deleteRecord('deal_c', params);
    
    if (!response.success) {
      console.error("Error deleting deals:", response.message);
      return false;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} deals:`, failed);
      }
      
      return successful.length === validIds.length;
    }
    
    return false;
  } catch (error) {
    console.error("Error deleting deals:", error?.response?.data?.message || error);
    return false;
  }
}

// Get deals by stage (for kanban board)
export async function getByStage(stage) {
  try {
    await delay(250);
    
    if (!stage) {
      console.error("Stage is required");
      return [];
    }
    
    const apperClient = getApperClient();
    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "value_c"}},
        {"field": {"Name": "stage_c"}},
        {"field": {"Name": "expected_close_date_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "probability_c"}},
        {"field": {"Name": "contact_id_c"}},
        {"field": {"Name": "created_at_c"}},
        {"field": {"Name": "updated_at_c"}},
        {"field": {"Name": "Tags"}}
      ],
      where: [
        {
          "FieldName": "stage_c",
          "Operator": "ExactMatch",
          "Values": [stage],
          "Include": true
        }
      ],
      orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
      pagingInfo: {"limit": 50, "offset": 0}
    };
    
    const response = await apperClient.fetchRecords('deal_c', params);
    
    if (!response.success) {
      console.error("Error fetching deals by stage:", response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching deals by stage:", error?.response?.data?.message || error);
    return [];
  }
}

// Export all functions
export const dealService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteDeal,
  getByStage
};
