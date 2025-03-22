const app = getApp();

Component({
  properties: {
    // Component properties
  },
  
  data: {
    campusName: '选择校区' // Default value
  },
  
  lifetimes: {
    attached() {
      // When component is attached, get the current campus name
      if (app.globalData.currentTenant) {
        // If campus data is already available
        this.updateCampusName();
      } else {
        // If campus data is not yet available, register a callback
        app.campusSwitcherReadyCallback = tenant => {
          if (tenant && tenant.name) {
            this.setData({
              campusName: tenant.name
            });
          }
        };
      }
      console.log('Campus switcher component attached');
    },
    
    detached() {
      // Clean up callback when component is detached
      if (app.campusSwitcherReadyCallback) {
        app.campusSwitcherReadyCallback = null;
      }
    }
  },
  
  pageLifetimes: {
    show() {
      // Update campus name when the page is shown
      this.updateCampusName();
      console.log('Campus switcher page shown');
    }
  },
  
  methods: {
    updateCampusName() {
      // Get current campus from global data
      const currentTenant = app.globalData.currentTenant;
      console.log('Current tenant:', currentTenant);
      
      if (currentTenant && currentTenant.name) {
        this.setData({
          campusName: currentTenant.name
        });
        console.log('Set campus name to:', currentTenant.name);
      } else {
        // If no campus is selected yet, use default
        this.setData({
          campusName: '选择校区'
        });
        console.log('No campus selected, using default name');
      }
    },
    
    switchCampus() {
      // Navigate to campus selection page
      console.log('Switching campus, navigating to selection page');
      wx.navigateTo({
        url: '/pages/wode/xiaoqu/xiaoqu',
        success: () => {
          console.log('Navigation to campus selection successful');
        },
        fail: (err) => {
          console.error('Navigation to campus selection failed:', err);
          // Fallback - try using switchTab if the page is a tab
          wx.showToast({
            title: '校区选择页面打开失败',
            icon: 'none'
          });
        }
      });
    }
  }
}) 