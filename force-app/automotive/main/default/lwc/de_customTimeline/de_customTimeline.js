import { LightningElement, wire, api, track } from 'lwc';
import getVehOptions from '@salesforce/apex/de_Auto_Timeline_Controller.getRelatedTimelineWTE';
import { refreshApex } from '@salesforce/apex';
import LightningConfirm from 'lightning/confirm';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';


export default class De_customTimeline extends NavigationMixin(LightningElement){

    @api recordId;

    @track isActivityModalNewOpen = false;
    @track isActivityModalEditOpen = false;

    @track activities = [];

    @api showNewActivityButton;
    @api componentTitle;
    @api titleIcon;
    @api heightInPixels = '300';

    @api activityToEditId;

    @track loading = false;

    wiredActivitiesResult; //useful for forcing refresh
    
   
    @wire(getVehOptions, {relatedToId: '$recordId'}) 
    wiredActivities(result){
        console.log('>>> '+JSON.stringify(result));
        this.loading=true;
        this.wiredActivitiesResult=result;
        if (result.data) {
          this.activities = JSON.stringify(result.data);

        console.log('OLD >> ' +this.activities);

            this.activities = result.data.map((item) => {
                let additionalValue = '';
                // Add value based on the condition
                if (item.Status === 'Not Started') {
                    additionalValue = 'custom:custom110';
                } else if (item.Status === 'In Progress') {
                    additionalValue = 'custom:custom23';
                } else if (item.Status === 'Completed') {
                    additionalValue = 'custom:custom31';
                } else if (item.Status === 'On Hold') {
                    additionalValue = 'custom:custom68';
                } else {
                    additionalValue = 'standard:events';
                }
                return { ...item, additionalValue };

            })

            console.log('NEW >> ' + JSON.stringify(this.activities));

        } else if (result.error) {
          this.error = result.error;
          console.log("Error "+ JSON.stringify(result.error));
          this.activities = undefined;
        }
        this.loading=false;
      }

    refreshIConClick(){
        refreshApex(this.wiredActivitiesResult);
    }
    
    openActivityModalNew() {
        this.isActivityModalNewOpen = true;
    }
    closeActivityModalNew() {
        this.isActivityModalNewOpen = false;
    }
    submitActivityModaNew() {
        this.isActivityModalNewOpen = false;
        return refreshApex(this.wiredActivitiesResult);
    }
    closeActivityModalEdit() {
        this.isActivityModalEditOpen = false;
    }
    submitActivityModalEdit() {
        this.isActivityModalEditOpen = false;
        return refreshApex(this.wiredActivitiesResult);
    }
    handleMenuSelect(event) {
        if(event.detail.value === "edit")
        {
            this.activityToEditId=event.target.dataset.id;
            this.isActivityModalEditOpen = true;

        }
        if(event.detail.value === "delete")
        {
            this.deleteActivity(event.target.dataset.id,event.target.dataset.title);
        }
    }
    deleteActivity(idToDel,titleToDel)
    {
        LightningConfirm.open({
            message: 'Are you sure you want to delete the activity "'+titleToDel+'" ?',
            theme: 'warning',
            label: 'Confirm deletion',
        }).then((result) => {
            this.loading=true;   
            deleteRecord(idToDel).then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Record deleted successfully',
                            variant: 'success'
                        })
                    );
                    this.loading=false;   
                    return refreshApex(this.wiredActivitiesResult);
                    
                })
                .catch(error => {
                    console.log(error);
                });
        });
    }
    handleSectionToggle(event) {
        let buttonId = event.currentTarget.dataset.buttonId;
        let currentsection = this.template.querySelector('[data-collapsible-section-id="' + buttonId + '"]');
        if (currentsection.className.search('slds-is-open') == -1) {
            currentsection.className = 'slds-timeline__item_expandable slds-is-open';
            event.target.iconName='utility:chevrondown';
        } else {
            currentsection.className = 'slds-timeline__item_expandable slds-is-close';
            event.target.iconName='utility:chevronright';
        }
    }

    invokeStreaming() {
        this.loading=true;
        streamNextActivity( {relatedToId: this.recordId})
        .then((result) => {
            refreshApex(this.wiredActivitiesResult);
            this.loading=false;            
        })
        .catch((error) => {
            console.log(error);
        });
        this.loading=false;   
   }

    get dynamicStyle() {
        return `height: ${this.heightInPixels}px;`;
    }

    formatDate(daysAgo){
        var date = new Date();
        date.setTime(date.getTime() - daysAgo * 86400000);
        var monthNames = [
            "Jan", "Feb", "Mar",
            "Apr", "May", "Jun", "Jul",
            "Aug", "Sep", "Oct",
            "Nov", "Dec"
        ];
        
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        var formatedDate = monthNames[monthIndex] + ' ' + day;

        return formatedDate;
        
    }

    handleItemclick(event){
        
        // Get the record Id from data-record-id attribute of clicked list item
        const recordId = event.currentTarget.dataset.recordId;
        console.log(recordId + 'onclick event fired');
        // Navigate to the record page using NavigationMixin
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Task', // Replace with your object API name
                actionName: 'view'
            }
        });


    }

    // #############

    

}