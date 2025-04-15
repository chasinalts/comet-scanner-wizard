import { initializeAdminAccount } from './security';

interface AdminUser {
  username: string;
  isOwner: boolean;
  permissions: {
    contentManagement: boolean;
    userManagement: boolean;
    systemConfiguration: boolean;
    mediaUploads: boolean;
    securitySettings: boolean;
    siteCustomization: boolean;
  };
}

export const verifyAdminSetup = (): boolean => {
  // First ensure admin account exists
  initializeAdminAccount();

  // Verify admin account configuration
  const adminData = localStorage.getItem('user_ChasinAlts');
  if (!adminData) {
    console.error('Admin account initialization failed');
    return false;
  }

  try {
    const admin = JSON.parse(adminData) as AdminUser;
    
    // Verify username
    if (admin.username !== 'ChasinAlts') {
      console.error('Admin username mismatch');
      return false;
    }

    // Verify owner status
    if (!admin.isOwner) {
      console.error('Admin is not set as owner');
      return false;
    }

    // Verify all required permissions
    const requiredPermissions = [
      'contentManagement',
      'userManagement',
      'systemConfiguration',
      'mediaUploads',
      'securitySettings',
      'siteCustomization'
    ];

    const hasAllPermissions = requiredPermissions.every(
      permission => admin.permissions[permission as keyof typeof admin.permissions]
    );

    if (!hasAllPermissions) {
      console.error('Admin missing required permissions');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying admin setup:', error);
    return false;
  }
};

// Function to log admin account status - useful for debugging
export const getAdminAccountStatus = (): Record<string, any> => {
  const adminData = localStorage.getItem('user_ChasinAlts');
  if (!adminData) {
    return { exists: false };
  }

  try {
    const admin = JSON.parse(adminData);
    const { password, ...safeAdminData } = admin;
    return {
      exists: true,
      ...safeAdminData
    };
  } catch (error) {
    return {
      exists: true,
      error: 'Failed to parse admin data'
    };
  }
};