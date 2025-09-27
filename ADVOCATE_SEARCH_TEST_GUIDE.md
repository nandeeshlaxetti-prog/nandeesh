# 🔍 Kleopatra API Test Guide

## 📋 Test Parameters (Karnataka)

### **State Code**: `KAR` (Karnataka)
### **Year**: `2021`
### **Registration Number**: `2271`
### **District ID**: `bangalore`

---

## 🧪 Test Cases

### **1. Advocate Name Search**

#### **Test Data:**
- **Advocate Name**: `John Doe` or `Smith Kumar`
- **Court Type**: `District`
- **State Code**: `KAR` (Karnataka)
- **Year**: `2021`

#### **Expected Behavior:**
1. **Primary Search**: Calls `/api/core/live/district-court/search/advocate`
2. **Parameters**: `{ name: "John Doe", stage: "BOTH", districtId: "bangalore" }`
3. **Fallback**: If advocate search fails, tries party search with same parameters
4. **Filtering**: Party search results filtered to only include cases with matching advocates

#### **Console Logs to Check:**
```
🔍 Advocate search: John Doe in district court
📋 Request body: { name: "John Doe", stage: "BOTH", districtId: "bangalore" }
✅ Advocate search success: 200
📊 Response data: [...]
```

---

### **2. Advocate Number Search**

#### **Test Data:**
- **Advocate Number**: `2271`
- **Court Type**: `District`
- **State Code**: `KAR` (Karnataka)
- **Year**: `2021`

#### **Expected Behavior:**
1. **Search**: Calls `/api/core/live/district-court/search/advocate-number`
2. **Parameters**: `{ advocate: { state: "KAR", number: "2271", year: "2021" }, stage: "BOTH", districtId: "bangalore" }`
3. **Response**: Returns cases associated with registration number 2271

#### **Console Logs to Check:**
```
🔍 Advocate number search: 2271 in district court
📤 Request body: { advocate: { state: "KAR", number: "2271", year: "2021" }, stage: "BOTH", districtId: "bangalore" }
✅ Advocate number search success: 200
📊 Response data: [...]
```

---

## 📚 Complete API Reference

### **1. CNR Lookup**
```bash
curl -X POST "https://court-api.kleopatra.io/api/core/live/district-court/case" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"cnr": "DLDL01-000001-2024"}'
```

### **2. Party Search**
```bash
curl -X POST "https://court-api.kleopatra.io/api/core/live/district-court/search/party" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "party name", "stage": "BOTH", "year": "2025", "districtId": "district_id"}'
```

### **3. Advocate Search**
```bash
curl -X POST "https://court-api.kleopatra.io/api/core/live/district-court/search/advocate" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "advocate name", "stage": "BOTH", "districtId": "district_id"}'
```

### **4. Advocate Number Search**
```bash
curl -X POST "https://court-api.kleopatra.io/api/core/live/district-court/search/advocate-number" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"advocate": {"state": "DL", "number": "12345", "year": "2020"}, "stage": "BOTH", "districtId": "district_id"}'
```

### **5. Filing Search**
```bash
curl -X POST "https://court-api.kleopatra.io/api/core/live/district-court/search/filing" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"filingNumber": "filing number", "filingYear": "2024", "districtId": "district_id"}'
```

### **6. Cause List (Future Implementation)**
```bash
curl -X POST "https://court-api.kleopatra.io/api/core/live/district-court/cause-list" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"courtId": "court_id", "date": "25/09/2025", "type": "CIVIL"}'
```

---

## 🔧 How to Test

### **Step 1: Open Cases Page**
1. Navigate to `http://localhost:3000/cases`
2. Click **"Advanced Search"** button

### **Step 2: Test Advocate Name Search**
1. Select **Court Type**: `District`
2. Select **Search Function**: `Advocate Search`
3. Enter **Advocate Name**: `John Doe`
4. Click **Search**
5. Check browser console for detailed logs

### **Step 3: Test Advocate Number Search**
1. Select **Court Type**: `District`
2. Select **Search Function**: `Advocate Number Search`
3. Enter **Advocate Number**: `2271`
4. Select **State Code**: `KAR`
5. Enter **Year**: `2021`
6. Click **Search**
7. Check browser console for detailed logs

---

## 📊 Expected API Responses

### **Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "cnr": "KAR123456789",
      "title": "Case Title",
      "parties": {
        "petitioners": ["Petitioner Name"],
        "respondents": ["Respondent Name"],
        "petitionerAdvocates": ["John Doe"],
        "respondentAdvocates": ["Smith Kumar"]
      },
      "status": {
        "caseStage": "Pending",
        "nextHearingDate": "2024-01-15"
      }
    }
  ],
  "total": 1
}
```

### **Error Response:**
```json
{
  "success": false,
  "error": "NO_CASES_FOUND",
  "message": "No cases found for the given advocate name"
}
```

---

## 🚨 Troubleshooting

### **If Advocate Search Fails:**
1. **Check Console Logs** - Look for detailed error messages
2. **Try Fallback** - System automatically tries party search
3. **Check API Key** - Ensure Kleopatra API key is valid
4. **Verify Parameters** - Check if state code and year are correct

### **Common Issues:**
- **404 Error**: Advocate search endpoint might not be available
- **400 Error**: Invalid parameters or missing required fields
- **Timeout**: API request taking too long (30s timeout)

### **Fallback Behavior:**
- **Primary**: Advocate search with Karnataka parameters
- **Fallback**: Party search with same parameters + advocate filtering
- **Result**: Cases where advocate name appears in advocates list

---

## 💡 Tips for Testing

1. **Use Real Data**: Test with actual advocate names from Karnataka
2. **Check Console**: Always monitor browser console for detailed logs
3. **Try Different Names**: Test with various advocate name formats
4. **Verify Results**: Check if returned cases actually contain the advocate
5. **Test Edge Cases**: Try with empty fields, invalid data, etc.

---

## 🎯 Success Criteria

✅ **Advocate search returns cases with matching advocates**
✅ **Fallback mechanism works when primary search fails**
✅ **Error messages are helpful and actionable**
✅ **Console logs provide detailed debugging information**
✅ **User interface shows appropriate feedback**
✅ **API parameters are correctly formatted**

---

## 📝 Test Results Template

| Test Case | Input | Expected | Actual | Status |
|-----------|-------|----------|--------|--------|
| Advocate Name | John Doe | Cases with John Doe as advocate | | |
| Advocate Number | 2271 | Cases with registration 2271 | | |
| Fallback Test | Invalid name | Party search fallback | | |
| Error Handling | Empty field | Clear error message | | |

---

**Happy Testing! 🚀**
