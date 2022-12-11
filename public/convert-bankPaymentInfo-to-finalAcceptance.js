const data = [
	{
		"ID": 159337,
		"fileName": "66873ce3-b637-4dd9-b08a-e79f1c70d945.jpg"
	},
	{
		"ID": 165803,
		"fileName": "40393f75-7eaa-43b2-ab93-4bb539d2708b.jpg"
	},
	{
		"ID": 94382,
		"fileName": "604e5a3e-79ee-4af0-a61a-905d6a678527.jpg"
	},
	{
		"ID": 154810,
		"fileName": "136f5989-5daf-4439-9b75-d24ac2f181cd.jpg"
	},
	{
		"ID": 121326,
		"fileName": "79d13ae8-9bb5-4a64-8dba-8528920bee44.jpg"
	},
	{
		"ID": 18526,
		"fileName": "b6331585-265b-4340-9b41-5831b439c4d0.jpg"
	},
	{
		"ID": 91429,
		"fileName": "deb02ccd-a54c-4f03-89bd-ee0679a2054f.jpg"
	},
	{
		"ID": 94382,
		"fileName": "c4d7a17e-94ca-4de9-ba5b-24ccb7779c24.jpg"
	},
	{
		"ID": 165803,
		"fileName": "c8dd4268-5acb-4a88-823e-33984d6a9f0c.jpg"
	},
	{
		"ID": 154810,
		"fileName": "c8574011-fb47-40c7-ac7a-070e2b1b4736.jpg"
	},
	{
		"ID": 112156,
		"fileName": "fdc10003-8418-4005-9397-c8eab89ac6c1.jpg"
	},
	{
		"ID": 158912,
		"fileName": "c9db5671-0122-4fda-8c53-4d23d9043db9.jpg"
	},
	{
		"ID": 91429,
		"fileName": "deb02ccd-a54c-4f03-89bd-ee0679a2054f.jpg"
	},
	{
		"ID": 117829,
		"fileName": "0d75f1d7-d1ac-42dc-9141-12311e30e05c.jpg"
	},
	{
		"ID": 94382,
		"fileName": "1e2d6d2e-b613-4289-93c5-68f991b6f5a2.jpg"
	}
];
data.forEach(request => {
	db.admission.find({ ID: request.ID }).toArray().forEach((it) => {
		const fileName = request.fileName;
		const data = {
			storedFileName: fileName,
			acceptanceLetterurl: `/api/container/files/download/${fileName}`
		};
		const formalLetter = {
			"fileID": "639395344f759622c4a87dff",
			"fileFieldKey": "acceptanceLetter",
			"fileName": `${it.ID
				} 001.jpg`,
			"storedFileName": data.storedFileName,
			"done": true,
			"url": data.acceptanceLetterurl
		};
		const acceptance = {
			"user": {
				"id": "60c09cdf4e30d71894b92e16",
				"firstName": "SyS",
				"lastName": "admin",
				"username": "SySadmin",
				"principalType": "employee"
			},
			"time": "2022-12-10T20:06:39.136Z",
			"action": "patchAttributes",
			"status": "paymentConfirmed",
			"state": "Processing",
			"newStatus": "finalAcceptance",
			"newState": "Processing",
			"internal": false,
			"isEdit": false,
			"data": {
				"acceptanceLetter": [
					{
						"fileID": "639395344f759622c4a87dff",
						"fileFieldKey": "acceptanceLetter",
						"fileName": `${it.ID} 001.jpg`,
						"storedFileName": data.storedFileName,
						"done": true,
						"url": data.acceptanceLetterurl
					}
				],
				"formalLetter": [
					{
						"fileID": "6393954b4f7596e9fea87e00",
						"fileFieldKey": "formalLetter",
						"fileName": "171921 001.jpg",
						"storedFileName": data.storedFileName,
						"done": true,
						"url": data.acceptanceLetterurl
					}
				]
			},
			"isPrivateComment": false,
			"activityName": "تم التنفيذ",
			"activityId": "kb9jrqtt",
			"selectedLabels": {},
			"userAgent": {
				"os": {
					"family": "Windows",
					"major": "7",
					"minor": "0",
					"patch": "0"
				},
				"device": {
					"family": "Other",
					"major": "0",
					"minor": "0",
					"patch": "0"
				},
				"browser": {
					"family": "Chrome",
					"major": "108",
					"minor": "0",
					"patch": "0"
				},
				"ip": "105.182.182.66"
			}
		};
		const paymentDone2 = {
			"user": {
				"id": "60c09cdf4e30d71894b92e16",
				"firstName": "SyS",
				"lastName": "admin",
				"username": "SySadmin",
				"principalType": "employee"
			},
			"time": "2022-12-10T14:21:22.523Z",
			"action": "patchAttributes",
			"status": "secondBankPaymentDetails",
			"state": "Processing",
			"newStatus": "paymentConfirmed",
			"newState": "Processing",
			"internal": false,
			"isEdit": false,
			"data": {},
			"isPrivateComment": false,
			"activityName": "تم السداد",
			"activityId": "kb8ijfo8",
			"selectedLabels": {},
			"userAgent": {
				"os": {
					"family": "Windows",
					"major": "10",
					"minor": "0",
					"patch": "0"
				},
				"device": {
					"family": "Other",
					"major": "0",
					"minor": "0",
					"patch": "0"
				},
				"browser": {
					"family": "Opera",
					"major": "73",
					"minor": "0",
					"patch": "3856"
				},
				"ip": "196.219.233.81"
			}
		};
		const paymentDone = it.history.find(({ newStatus }) => newStatus === "paymentConfirmed");
		if (!paymentDone && it.status === "secondBankPaymentDetails") {
			db.InvoiceNumbers.insertOne({ invoiceNumber: it.SecondInvoiceNumber, serviceSlug: it.serviceSlug, ID: it.ID });
			it.status = "paymentConfirmed";
			it.history.push(paymentDone2);
		};
		const finalAcceptanceDone = it.history.find(({ newStatus }) => newStatus === "finalAcceptance");
		if ((it.SecondInvoiceNumber || (it.paymentRequestNumber && it.paymentActivity == "SecondNbePayment" && it.paymentDate2)) && !finalAcceptanceDone) {
			it.history.push(acceptance);
			it.formalLetter = formalLetter;
			it.status = "finalAcceptance";
		};
		db.admission.save(it);
	});
});
